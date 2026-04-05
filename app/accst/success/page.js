'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

function SuccessPageInner() {
  const params = useSearchParams()
  const router = useRouter()
  const token = params.get('token')
  console.log('TOKEN:', token)

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/get-application', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        })

        const result = await res.json()

        if (!res.ok || result.error) {
          console.log('API Error:', result.error)
          setData(null)
        } else {
          setData(result.application)
        }

        setLoading(false)
      } catch (err) {
        console.log(err)
        setLoading(false)
      }
    }

    if (token) fetchData()
  }, [token])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    )
  }

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-lg text-red-500">Invalid access. No token provided.</p>
        <button
          onClick={() => router.push('/accst')}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Go Back
        </button>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-lg text-red-500">Unable to fetch your application.</p>
        <button
          onClick={() => router.push('/accst')}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Go Back
        </button>
      </div>
    )
  }

  const form = data.form_data || {}

  const downloadPDF = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-[#e3eeff] px-4 py-10 flex flex-col items-center">

      {/* SUCCESS HEADER */}
      <div className="text-center mb-8 no-print">
        <h1 className="text-3xl font-bold text-green-600">
          Application Submitted Successfully
        </h1>
        <p className="mt-2 text-gray-600">
          Your registration is complete. Download your admit card below.
        </p>
      </div>

      {/* ADMIT CARD */}
      <div
        id="admit-card"
        className="w-full max-w-[794px] bg-white p-8 border shadow print:shadow-none break-inside-avoid"
      >

        {/* HEADER */}
        <div className="border-b pb-4">
          <div className="flex items-center justify-between">
            <img src="/logo.png" className="w-16 h-16" />
            <div className="text-center flex-1">
              <h2 className="text-xl font-extrabold tracking-wide leading-tight">AJAY CTET CLASSES</h2>
              <p className="text-sm font-medium">Scholarship Test (ACCST)</p>
              <p className="text-lg font-bold mt-1 border-t border-b py-1 inline-block px-4">
                ADMIT CARD
              </p>
            </div>
            <div className="w-16" />
          </div>
        </div>

        {/* PERSONAL DETAILS */}
        <div className="mt-6 border p-4 rounded">
          <h3 className="font-semibold border-b pb-1 mb-3">Personal Details</h3>

          <div className="grid grid-cols-3 gap-4">

            {/* DETAILS */}
            <div className="col-span-2 space-y-2 text-sm">
              <p className="text-base font-semibold"><b>Name:</b> {form.name}</p>
              <p><b>Father's Name:</b> {form.fatherName}</p>
              <p><b>Phone:</b> {form.phone}</p>
              <p><b>Category:</b> {form.category}</p>
            </div>

            {/* PHOTO + SIGN */}
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-28 h-32 border flex items-center justify-center text-xs text-gray-500 p-2">
                Paste your photo here and sign in the box below
              </div>
              <div className="w-28 h-12 border" />
            </div>

          </div>
        </div>

        {/* EXAM DETAILS */}
        <div className="mt-6 border p-4 rounded">
          <h3 className="font-semibold border-b pb-1 mb-3">Examination Details</h3>

          <div className="text-sm space-y-2">
            <p><b>Exam Date:</b> {form.slot}</p>
            <p><b>Mode:</b> Offline</p>
            <p><b>Venue:</b> Ajay CTET Classes, Gokul Chowk, Saharsa</p>
          </div>
        </div>

        {/* INSTRUCTIONS */}
        <div className="mt-6 border p-4 rounded">
          <h3 className="font-semibold border-b pb-1 mb-3">Instructions</h3>

          <div className="text-xs text-gray-700 space-y-1 leading-relaxed">
            <p>• Carry this admit card to the exam center</p>
            <p>• Bring a valid ID proof</p>
            <p>• Reach the venue at least 30 minutes early</p>
            <p>• Calculators, mobile phones, and electronic devices are strictly prohibited</p>
            <p>• Do not carry any unfair materials or notes inside the examination hall</p>
            <p>• Follow all instructions given by invigilators</p>
            <p>• Maintain discipline and silence during the examination</p>
            <p>• Late entry may not be allowed under any circumstances</p>
          </div>
        </div>

      </div>

      {/* BUTTONS */}
      <div className="mt-6 flex gap-4 no-print">
        <button
          onClick={downloadPDF}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg cursor-pointer active:scale-95 transition hover:scale-[1.02] hover:shadow-lg"
        >
          Print / Download Admit Card
        </button>

        <button
          onClick={() => router.push('/accst')}
          className="border px-6 py-3 rounded-lg cursor-pointer active:scale-95 transition hover:scale-[1.02] hover:shadow-md hover:bg-gray-100"
        >
          Back to Home
        </button>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }

          #admit-card, #admit-card * {
            visibility: visible;
          }

          #admit-card {
            position: absolute;
            left: 0;
            top: 0;
            width: 794px;
            min-height: 1123px;
            padding: 20px;
            box-shadow: none;
            border: none;
          }

          .no-print {
            display: none !important;
          }
        }
      `}</style>

    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessPageInner />
    </Suspense>
  )
}
