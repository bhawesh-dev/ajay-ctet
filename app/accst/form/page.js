'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'


function FormPageInner() {

  const [loading, setLoading] = useState(false)

  const params = useSearchParams()
  const token = params.get('token')
  const [form, setForm] = useState({
    name: '',
    dob: '',
    phone: '',
    whatsapp: '',
    email: '',
    category: '',
    address: '',
    fatherName: '',
    motherName: '',
    fatherOccupation: '',
    parentPhone: '',
    degree: '',
    ctetLevel: '',
    subject: '',
    slot: ''
  })

  const [errors, setErrors] = useState({})
  const [sameWhatsapp, setSameWhatsapp] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target

    // Name fields (no numbers)
    if (['name','fatherName','motherName','fatherOccupation'].includes(name)) {
      if (!/^[A-Za-z ]*$/.test(value)) return
    }

    // Phone fields (max 10 digits)
    if (['phone','whatsapp','parentPhone'].includes(name)) {
      if (!/^[0-9]*$/.test(value) || value.length > 10) return
    }

    // Address length limit
    if (name === 'address' && value.length > 150) return

    setForm(prev => ({ ...prev, [name]: value }))

    // auto sync whatsapp
    if (name === 'phone' && sameWhatsapp) {
      setForm(prev => ({ ...prev, whatsapp: value }))
    }
  }

  const validate = () => {
    const err = {}

    if (!form.name) err.name = 'Name required'
    if (!form.dob) err.dob = 'DOB required'
    if (!/^[0-9]{10}$/.test(form.phone)) err.phone = 'Invalid phone'
    if (!/^[0-9]{10}$/.test(form.whatsapp)) err.whatsapp = 'Invalid WhatsApp'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = 'Invalid email'
    if (!form.category) err.category = 'Select category'
    if (!form.address) err.address = 'Address required'
    if (!form.fatherName) err.fatherName = 'Required'
    if (!form.motherName) err.motherName = 'Required'
    if (!form.fatherOccupation) err.fatherOccupation = 'Required'
    if (!/^[0-9]{10}$/.test(form.parentPhone)) err.parentPhone = 'Invalid parent phone'
    if (!form.degree) err.degree = 'Select degree'
    if (!form.ctetLevel) err.ctetLevel = 'Select level'
    if (form.ctetLevel === '6-8' && !form.subject) err.subject = 'Select subject'
    if (!form.slot) err.slot = 'Select slot'

    setErrors(err)
    return Object.keys(err).length === 0
  }

  const handleSubmit = async () => {
  if (loading) return
  if (!validate()) return

  setLoading(true)

  try {
    const res = await fetch('/api/submit-form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, formData: form })
    })

    const data = await res.json()

    if (data.error) {
      alert(data.error)
      setLoading(false)
      return
    }

    window.location.href = `/accst/success?token=${token}`

  } catch (err) {
    console.log(err)
    alert('Submission failed')
    setLoading(false)
  }
}

  return (
    <div className="min-h-screen bg-[#e3eeff] flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-xl border">

        <h1 className="text-2xl font-bold text-center text-blue-900 mb-2">
          Application Form
        </h1>

        <p className="text-center text-gray-500 mb-6 text-sm">
          Fill all details carefully
        </p>

        <div className="space-y-6">

          {/* PERSONAL DETAILS */}
          <div>
            <h2 className="font-semibold text-blue-900 mb-3">Personal Details</h2>

            <div className="space-y-4">

              <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" className="w-full border p-3 rounded-lg" />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

              <div>
                <label className="text-sm text-gray-600 block mb-1">
                  Date of Birth (DD/MM/YYYY)
                </label>
                <input
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-lg"
                />
              </div>
              {errors.dob && <p className="text-red-500 text-sm">{errors.dob}</p>}

              <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" className="w-full border p-3 rounded-lg" />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

              {/* WhatsApp */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={sameWhatsapp}
                  onChange={(e) => {
                    setSameWhatsapp(e.target.checked)
                    if (e.target.checked) {
                      setForm(prev => ({ ...prev, whatsapp: prev.phone }))
                    } else {
                      setForm(prev => ({ ...prev, whatsapp: '' }))
                    }
                  }}
                />
                <label className="text-sm">Same as phone number</label>
              </div>
              <input name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="WhatsApp Number" className="w-full border p-3 rounded-lg" />
              {errors.whatsapp && <p className="text-red-500 text-sm">{errors.whatsapp}</p>}

              <input name="email" value={form.email} onChange={handleChange} placeholder="Email Address" className="w-full border p-3 rounded-lg" />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

              {/* Category */}
              <select name="category" value={form.category} onChange={handleChange} className="w-full border p-3 rounded-lg">
                <option value="">Select Category</option>
                <option>General</option>
                <option>OBC</option>
                <option>EWS</option>
                <option>SC</option>
                <option>ST</option>
              </select>
              {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}


              <textarea name="address" value={form.address} onChange={handleChange} placeholder="Full Address" className="w-full border p-3 rounded-lg"></textarea>
              {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}

            </div>
          </div>

          {/* FAMILY DETAILS */}
          <div>
            <h2 className="font-semibold text-blue-900 mb-3">Family Details</h2>

            <div className="space-y-4">

              <input name="fatherName" value={form.fatherName} onChange={handleChange} placeholder="Father's Name" className="w-full border p-3 rounded-lg" />
              {errors.fatherName && <p className="text-red-500 text-sm">{errors.fatherName}</p>}

              <input name="motherName" value={form.motherName} onChange={handleChange} placeholder="Mother's Name" className="w-full border p-3 rounded-lg" />
              {errors.motherName && <p className="text-red-500 text-sm">{errors.motherName}</p>}

              <input name="fatherOccupation" value={form.fatherOccupation} onChange={handleChange} placeholder="Father's Occupation" className="w-full border p-3 rounded-lg" />
              {errors.fatherOccupation && <p className="text-red-500 text-sm">{errors.fatherOccupation}</p>}

              <input name="parentPhone" value={form.parentPhone} onChange={handleChange} placeholder="Parent's Phone Number" className="w-full border p-3 rounded-lg" />
              {errors.parentPhone && <p className="text-red-500 text-sm">{errors.parentPhone}</p>}

            </div>
          </div>

          {/* EDUCATIONAL DETAILS */}
          <div>
            <h2 className="font-semibold text-blue-900 mb-3">Educational Details</h2>

            <div className="space-y-4">

              <select name="degree" value={form.degree} onChange={handleChange} className="w-full border p-3 rounded-lg">
                <option value="">Select Degree</option>
                <option value="DLED">D.El.Ed</option>
                <option value="BED">B.Ed</option>
              </select>
              {errors.degree && <p className="text-red-500 text-sm">{errors.degree}</p>}

              <select name="ctetLevel" value={form.ctetLevel} onChange={handleChange} className="w-full border p-3 rounded-lg">
                <option value="">Select CTET Level</option>
                <option value="1-5">Class 1-5</option>
                <option value="6-8">Class 6-8</option>
              </select>
              {errors.ctetLevel && <p className="text-red-500 text-sm">{errors.ctetLevel}</p>}

              {form.ctetLevel === '6-8' && (
                <>
                  <select name="subject" value={form.subject} onChange={handleChange} className="w-full border p-3 rounded-lg">
                    <option value="">Select Subject</option>
                    <option value="Social">Social Studies</option>
                    <option value="Science">Science</option>
                  </select>
                  {errors.subject && <p className="text-red-500 text-sm">{errors.subject}</p>}
                </>
              )}


              <select name="slot" value={form.slot} onChange={handleChange} className="w-full border p-3 rounded-lg">
                <option value="">Select Exam Slot</option>
                <option>12 April</option>
                <option>19 April</option>
                <option>26 April</option>
              </select>
              {errors.slot && <p className="text-red-500 text-sm">{errors.slot}</p>}

            </div>
          </div>

        </div>

        <button
  onClick={handleSubmit}
  disabled={loading}
  className={`mt-6 w-full py-3 rounded-lg font-semibold transition ${
    loading 
      ? 'bg-gray-400 cursor-not-allowed' 
      : 'bg-yellow-400 hover:scale-[1.02] hover:shadow-lg active:scale-95 cursor-pointer'
  }`}
>
  {loading ? 'Submitting...' : 'Submit Application'}
</button>

      </div>

    </div>
  )
  
}

export default function FormPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FormPageInner />
    </Suspense>
  )
}