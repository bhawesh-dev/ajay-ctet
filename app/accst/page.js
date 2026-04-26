'use client'

import { useState, useRef, useEffect } from 'react'
import Script from 'next/script'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'


export default function ACCST() {
  
  const [showModal, setShowModal] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '' })
  const [leadForm, setLeadForm] = useState({ name: '', phone: '', email: '' })
  const [errors, setErrors] = useState({})
  const videoRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [paymentInProgress, setPaymentInProgress] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setShowModal(false)
    setErrors({})
  }, [pathname])

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (paymentInProgress) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [paymentInProgress])

  
  

  const validate = () => {
    const newErrors = {}

    // Name: only letters + spaces, min 2 chars
    if (!form.name || !/^[A-Za-z ]{2,}$/.test(form.name)) {
      newErrors.name = 'Enter a valid name'
    }

    // Phone: exactly 10 digits
    if (!/^[0-9]{10}$/.test(form.phone)) {
      newErrors.phone = 'Enter valid 10-digit number'
    }

    // Email: basic regex
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Enter valid email'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'name') {
      if (/^[A-Za-z ]*$/.test(value)) {
        setForm(prev => ({ ...prev, [name]: value }))
      }
    } else if (name === 'phone') {
      if (/^[0-9]*$/.test(value) && value.length <= 10) {
        setForm(prev => ({ ...prev, [name]: value }))
      }
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleLeadChange = (e) => {
    const { name, value } = e.target
    if (name === 'name') {
      if (/^[A-Za-z ]*$/.test(value)) {
        setLeadForm(prev => ({ ...prev, [name]: value }))
      }
    } else if (name === 'phone') {
      if (/^[0-9]*$/.test(value) && value.length <= 10) {
        setLeadForm(prev => ({ ...prev, [name]: value }))
      }
    } else {
      setLeadForm(prev => ({ ...prev, [name]: value }))
    }
  }
  const handleLeadSubmit = async () => {
    if (!leadForm.name || !leadForm.phone || !leadForm.email) {
      alert('Please fill all details')
      return
    }

    try {
      const { error } = await supabase.from('leads').insert([leadForm])
      if (error) {
        alert('Something went wrong')
        return
      }
      alert('We will contact you shortly!')
      setLeadForm({ name: '', phone: '', email: '' })
    } catch (err) {
      alert('Error submitting form')
    }
  }

  let timeoutId
  const handleSubmit = async () => {
    if (loading) return  // 🚨 prevent double click
    if (!validate()) return

    setLoading(true)
    setPaymentInProgress(true)

    try {
      const resumeRes = await fetch('/api/resume-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: form.phone })
      })

      const resumeData = await resumeRes.json()

      // CASE: already completed
      if (resumeData.type === 'completed') {
        setStatusMessage('Application already completed. Redirecting...')
        clearTimeout(timeoutId)
        setTimeout(() => {
          router.push(`/accst/success?token=${resumeData.token}`)
        }, 1000)
        setPaymentInProgress(false)
        return
      }

      // CASE: resume or paid resume
      if (resumeData.type === 'resume' || resumeData.type === 'paid_resume') {
        setStatusMessage('Resuming your application...')
        clearTimeout(timeoutId)
        setTimeout(() => {
          router.push(`/accst/form?token=${resumeData.token}`)
        }, 1000)
        setPaymentInProgress(false)
        return
      }
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      const data = await res.json()
      if (data.error) {
        alert(data.error)
        setLoading(false)
        setPaymentInProgress(false)
        return
      }

      const user = data.user

      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id })
      })

      const orderData = await orderRes.json()
      if (orderData.error) {
        alert(orderData.error)
        setLoading(false)
        setPaymentInProgress(false)
        return
      }

      const options = {
        key: orderData.key,
        amount: 10000,
        currency: 'INR',
        name: 'Ajay CTET Classes',
        description: 'ACCST Test Fee',
        order_id: orderData.order_id,
        modal: {
          ondismiss: function () {
            clearTimeout(timeoutId)
            alert('Payment cancelled or failed. Please try again.')
            setPaymentInProgress(false)
            setLoading(false)
          }
        },
        handler: async function (response) {
          clearTimeout(timeoutId)
          const verifyRes = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id
            })
          })

          const verifyData = await verifyRes.json()

          if (verifyData.error) {
            alert('Payment verification failed')
            setLoading(false)
            setPaymentInProgress(false)
            return
          }

          router.push(`/accst/form?token=${verifyData.token}`)
        }
      }

      localStorage.setItem('payment_phone', form.phone)

      const rzp = new window.Razorpay(options)
      rzp.open()
      timeoutId = setTimeout(() => {
        alert('If your payment is deducted but the form does not open, please use the "Already paid? Click here" option.')
      }, 60000)

    } catch (err) {
      console.log(err)
      alert('Something went wrong')
      setLoading(false)
      setPaymentInProgress(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#e3eeff] text-black pt-16">

      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      {/* NAVBAR */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 md:px-8 py-3 bg-blue-900/90 backdrop-blur text-white shadow">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
          <img src="/logo.PNG" alt="logo" className="w-8 h-8 rounded-full" />
          <span className="font-semibold">Ajay CTET Classes</span>
        </div>
        <button
          onClick={() => {
            setShowTutorial(true)
            if (videoRef.current) videoRef.current.pause()
          }}
          className="bg-yellow-400 text-black px-4 py-2 rounded-md font-semibold active:scale-95 cursor-pointer transition hover:scale-[1.05] hover:shadow-md"
        >
          Contact Us
        </button>
      </header>

      {/* HERO */}
      <section className="px-4 py-10 bg-[#dbeafe]">
        <div className="max-w-xl md:max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-10 text-center transform transition duration-300 hover:scale-[1.03] hover:shadow-2xl animate-[floaty_5s_ease-in-out_infinite] hover:[animation-play-state:paused]">
          <h1 className="text-2xl md:text-4xl font-bold leading-snug">
            ACCST Scholarship Test is Over
          </h1>
          <p className="mt-4 text-lg md:text-xl font-semibold text-gray-800">
            Admissions are now open for new batches
          </p>
          <p className="mt-2 text-red-600 md:text-lg font-semibold">
            Apply now for direct admission in Ajay CTET Classes
          </p>
        </div>

        

        {/* CTA BUTTONS inside HERO */}
        <div className="max-w-xl md:max-w-3xl mx-auto mt-8 bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4 text-center">
            Direct Admission Inquiry
          </h3>
          <div className="space-y-4">
            <input
              name="name"
              value={leadForm.name}
              onChange={handleLeadChange}
              placeholder="Full Name"
              className="w-full border p-3 rounded-lg"
            />
            <input
              name="phone"
              value={leadForm.phone}
              onChange={handleLeadChange}
              placeholder="Phone Number"
              className="w-full border p-3 rounded-lg"
            />
            <input
              name="email"
              value={leadForm.email}
              onChange={handleLeadChange}
              placeholder="Email Address"
              className="w-full border p-3 rounded-lg"
            />
            <button
              onClick={handleLeadSubmit}
              className="w-full bg-yellow-400 py-3 rounded-lg font-semibold"
            >
              Submit & Get Call Back
            </button>
          </div>
        </div>
      </section>

      <style jsx>{`
@keyframes floaty {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
`}</style>


      {/* TUTORIAL MODAL */}
      {false && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[90%] max-w-xl shadow-2xl border">

            <h2 className="text-lg font-bold text-center mb-4">
              Please watch this tutorial before applying
            </h2>

            <video
              controls
              autoPlay
              className="w-full rounded-lg mb-4"
            >
              <source src="https://res.cloudinary.com/dc1d9ynpp/video/upload/v1776305530/tutorial_pqrqa7.mp4" />
            </video>

            <button
              onClick={() => {
                setShowTutorial(false)
                setShowModal(true)
              }}
              className="w-full bg-yellow-400 text-black py-3 rounded-lg font-semibold hover:scale-[1.02] transition cursor-pointer"
            >
              Skip Tutorial & Continue
            </button>

          </div>
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl w-[90%] max-w-md shadow-2xl border border-gray-200">

            <h2 className="font-bold mb-6 text-center text-xl text-blue-900">
              Apply for ACCST
            </h2>

            {paymentInProgress && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-3 text-sm">
                ⚠️ Do NOT refresh or close this page while payment is in progress.
              </div>
            )}

            <div className="space-y-4">

              {/* Name */}
              <div>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full border border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 p-3 rounded-lg"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Phone */}
              <div>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full border border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 p-3 rounded-lg"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              {/* Email */}
              <div>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="w-full border border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 p-3 rounded-lg"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

            </div>

            {statusMessage && (
              <p className="text-sm text-blue-600 text-center mb-2">
                {statusMessage}
              </p>
            )}


                        <div className="text-sm text-gray-600 text-center mt-2">
              Already paid but form didn’t open?
              <button
                onClick={async () => {
                  try {
                    if (!form.phone) {
                      alert('Please enter the same details used during payment.')
                      return
                    }

                    const res = await fetch('/api/resume-application', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ phone: form.phone })
                    })

                    const data = await res.json()

                    if (data.type === 'completed') {
                      router.push(`/accst/success?token=${data.token}`)
                      return
                    }

                    if (data.type === 'resume' || data.type === 'paid_resume') {
                      router.push(`/accst/form?token=${data.token}`)
                      return
                    }

                    alert('No payment found. Please use the same phone number.')
                  } catch (err) {
                    alert('Something went wrong. Please try again.')
                  }
                }}
                className="text-blue-600 underline ml-1 cursor-pointer"
              >
                Click here
              </button>
            </div>

            {/* Buttons */}
            <div className="mt-6 space-y-3">

              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-yellow-400 hover:scale-[1.02] hover:shadow-lg active:scale-95 cursor-pointer'
                }`}
              >
                {loading ? 'Processing payment...' : 'Continue'}
              </button>
              {loading && (
                <p className="text-sm text-blue-600 text-center mt-2">
                  Payment done but not redirected? Please wait or retry shortly.
                </p>
              )}

              <button
                onClick={() => setShowModal(false)}
                className="w-full border border-gray-300 py-3 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

            </div>
          </div>
        </div>
      )}

    {/* FOOTER */}
    <footer className="mt-10 bg-blue-900 text-white px-4 py-10">
      <div className="max-w-xl md:max-w-3xl mx-auto flex flex-col md:flex-row justify-between gap-6 text-left">

        {/* LEFT SIDE */}
        <div className="flex items-start gap-3">
          <img src="/logo.PNG" alt="logo" className="w-10 h-10 rounded-full" />
          <div>
            <h3 className="font-semibold text-lg">Ajay CTET Classes</h3>
            <p className="text-sm text-gray-300 mt-1">
              Empowering future teachers through quality guidance and exam preparation.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="text-sm space-y-3">

          {/* Contact */}
          <div className="space-y-1">
            <p>
              Email: <a href="mailto:support@ajayctetclasses.in" className="underline cursor-pointer hover:opacity-90">support@ajayctetclasses.in</a>
            </p>
            <p>
              Phone: <a href="tel:01169272938" className="underline">011 692 729 38</a>
            </p>
          </div>

          {/* Social */}
          <div className="flex gap-4">
            <a href="https://youtube.com/@ajayctetclasses?si=g0BMOpn6nnwdwHBp" className="hover:underline">YouTube</a>
            <a href="https://www.facebook.com/profile.php?id=100064956731017" className="hover:underline">Facebook</a>
            <a href="https://www.instagram.com/ajayctetclasses?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" className="hover:underline">Instagram</a>
          </div>

        </div>

      </div>

      {/* Bottom line */}
      <div className="max-w-xl md:max-w-3xl mx-auto mt-6 border-t border-blue-800 pt-4 text-center text-xs text-gray-300">
        © {new Date().getFullYear()} Ajay CTET Classes. All rights reserved.
      </div>
    </footer>

    </div>
  )
}
// End of file