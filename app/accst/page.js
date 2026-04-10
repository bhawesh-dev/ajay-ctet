'use client'

import { useState, useRef, useEffect } from 'react'
import Script from 'next/script'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'


export default function ACCST() {
  
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '' })
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
            setShowModal(true)
            if (videoRef.current) videoRef.current.pause()
          }}
          className="bg-yellow-400 text-black px-4 py-2 rounded-md font-semibold active:scale-95 cursor-pointer transition hover:scale-[1.05] hover:shadow-md"
        >
          Apply Now
        </button>
      </header>

      {/* HERO */}
      <section className="px-4 py-10 bg-[#dbeafe]">
        <div className="max-w-xl md:max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-10 text-center transform transition duration-300 hover:scale-[1.03] hover:shadow-2xl animate-[floaty_5s_ease-in-out_infinite] hover:[animation-play-state:paused]">

          <h1 className="text-2xl md:text-4xl font-bold leading-snug">
            <span className="text-blue-900 font-extrabold text-3xl md:text-5xl">A</span>jay{' '}
            <span className="text-blue-900 font-extrabold text-3xl md:text-5xl">C</span>TET{' '}
            <span className="text-blue-900 font-extrabold text-3xl md:text-5xl">C</span>lasses{' '}
            <span className="text-blue-900 font-extrabold text-3xl md:text-5xl">S</span>cholarship{' '}
            <span className="text-blue-900 font-extrabold text-3xl md:text-5xl">T</span>est
          </h1>

          <p className="mt-4 text-lg md:text-xl font-semibold text-gray-800">
            ₹11,000 की कोचिंग अब सिर्फ ₹100 में
          </p>

          <p className="mt-2 text-red-600 md:text-lg font-semibold">
            100% तक स्कॉलरशिप पाने का मौका
          </p>

        </div>

        {/* VIDEO inside HERO */}
        <div className="max-w-xl md:max-w-3xl mx-auto mt-6">
          <video
            ref={videoRef}
            autoPlay
            loop
            playsInline
            controls
            className="w-full aspect-video rounded-xl shadow"
          >
            <source src="https://res.cloudinary.com/dc1d9ynpp/video/upload/f_auto,q_auto/video_ihs3dr.mp4" />
          </video>
        </div>

        {/* CTA BUTTONS inside HERO */}
        <div className="max-w-xl md:max-w-3xl mx-auto flex flex-col md:flex-row gap-4 mt-8">

          <button
            onClick={() => {
              setShowModal(true)
              if (videoRef.current) videoRef.current.pause()
            }}
            className="w-full md:flex-1 bg-blue-700 text-white py-3 md:py-5 md:px-6 rounded-lg md:rounded-sm font-semibold active:scale-95 cursor-pointer transition hover:scale-[1.02] hover:shadow-lg"
          >
            Apply for ACCST (₹100)
          </button>

          <button
          onClick={() => window.location.href = '/api/create-direct-order'}
            className="w-full md:flex-1 bg-yellow-400 text-black py-3 md:py-5 md:px-6 rounded-lg md:rounded-sm font-semibold active:scale-95 cursor-pointer transition hover:scale-[1.02] hover:shadow-lg"
          >
            Direct Admission (₹11,000)
          </button>
        </div>
      </section>

      <style jsx>{`
@keyframes floaty {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
`}</style>

      {/* HOW IT WORKS */}
      <section className="px-4 py-10 text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-8 text-blue-900">
          कैसे मिलेगा डिस्काउंट?
        </h2>

        <div className="max-w-xl mx-auto flex flex-col items-center gap-4">

          {/* Card 1 */}
          <div className="w-full bg-yellow-100 p-4 rounded-xl shadow-md border border-yellow-300">
            ₹100 देकर टेस्ट दें
          </div>

          <div className="text-3xl">⬇️</div>

          {/* Card 2 */}
          <div className="w-full bg-yellow-400 p-5 rounded-2xl shadow-2xl border-2 border-yellow-500 transform scale-[1.03]">
            <div className="font-semibold text-lg">आपका स्कोर = आपकी स्कॉलरशिप</div>
          </div>

          <div className="text-3xl">⬇️</div>

          {/* Card 3 */}
          <div className="w-full bg-yellow-100 p-4 rounded-xl shadow-md border border-yellow-300">
            बैच में एडमिशन लें
          </div>

        </div>
      </section>

      {/* EXAM DETAILS */}
      <section className="px-4 py-12">
        <h2 className="text-center text-2xl md:text-3xl font-extrabold mb-10 text-blue-900">
          Exam Details
        </h2>

        <div className="max-w-xl md:max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">

          <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-blue-700">
            <p className="text-sm text-gray-500">Subjects</p>
            <p className="font-semibold mt-1">Hindi, English, Maths</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-yellow-400">
            <p className="text-sm text-gray-500">Exam Dates</p>
            <p className="font-semibold mt-1">12, 19, 26 April</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-green-600">
            <p className="text-sm text-gray-500">Mode</p>
            <p className="font-semibold mt-1">Offline</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-purple-600">
            <p className="text-sm text-gray-500">Venue</p>
            <p className="font-semibold mt-1">Ajay CTET Classes, Gokul Chowk, Gangjala, Saharsa</p>
          </div>

        </div>
      </section>


      {/* POSTER */}
      <section className="px-4 py-6">
        <div className="max-w-xl md:max-w-3xl mx-auto">
          <img src="/poster.jpg" className="w-full rounded-xl shadow" />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-4 py-10 text-center">

        <p className="mb-4 text-lg md:text-xl font-semibold text-red-600">
          Offer valid upto 1000 admissions
        </p>

        <p className="mb-4 text-lg md:text-xl font-semibold text-red-600">
          Apply Early⚡
        </p>

        <button
          onClick={() => {
            setShowModal(true)
            if (videoRef.current) videoRef.current.pause()
          }}
          className="bg-yellow-400 text-black px-8 py-4 rounded-md font-bold text-lg animate-pulse active:scale-95 cursor-pointer transition hover:scale-[1.03] hover:shadow-xl"
        >
          Apply Now (₹100)
        </button>

      </section>

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