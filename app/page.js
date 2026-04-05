'use client'

import { useEffect, useState } from 'react'

export default function Home() {
  const [dots, setDots] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'))
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-[#eef4ff] text-black pt-16">

      {/* NAVBAR */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 py-3 bg-blue-900/90 backdrop-blur text-white shadow-lg">
        <button onClick={() => window.location.href = '/'} className="flex items-center gap-2 cursor-pointer">
          <img src="/logo.PNG" alt="logo" className="w-8 h-8 rounded-full" />
          <h1 className="text-lg font-bold">Ajay CTET Classes</h1>
        </button>

        <button
          onClick={() => window.location.href = '/accst'}
          className="bg-yellow-400 text-black px-4 py-2 rounded-md font-semibold hover:bg-yellow-500 transition cursor-pointer active:scale-95"
        >
          Apply Now
        </button>
      </header>

      {/* HERO */}
      <section className="text-center py-24 px-4 bg-[#dbeafe] text-black">
        <h2 className="text-4xl font-bold leading-snug tracking-tight">
          CTET की तैयारी अब और आसान
        </h2>

        <p className="mt-4 text-lg text-gray-700">
          अब पढ़ाई होगी सही दिशा में 🚀
        </p>
        <div className="mt-10 h-1 w-24 mx-auto bg-blue-500 rounded"></div>
      </section>

      {/* MAIN CARD */}
      <section className="py-16 px-4 text-center">

        <h3 className="text-xl font-semibold mb-6">
          Ongoing Opportunity
        </h3>

        <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition duration-300">

          <h4 className="text-xl font-bold text-blue-800">
            Scholarship Test 2026
          </h4>

          <p className="mt-3 text-gray-600">
            Get up to <span className="text-red-600 font-semibold">100% scholarship</span>
            <br />
            for July-2026 Batch
          </p>

          <button
            onClick={() => window.location.href = '/accst'}
            className="mt-6 w-full bg-yellow-400 hover:bg-yellow-500 text-black py-3 rounded-lg font-semibold transition cursor-pointer active:scale-95"
          >
            Apply Now
          </button>

        </div>

      </section>

      {/* UNDER DEVELOPMENT */}
      <section className="text-center py-10">
        <div className="inline-block px-6 py-3 bg-blue-700 text-white rounded-full text-sm font-semibold shadow-lg animate-bounce">
          🚧 Website Building In Progress{dots}
        </div>
      </section>

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
                Email: <a href="mailto:ajayctetclasses@gmail.com" className="underline cursor-pointer hover:opacity-90">ajayctetclasses@gmail.com</a>
              </p>
              <p>
                Phone: <a href="tel:+919000000000" className="underline">+91 9000000000</a>
              </p>
            </div>

            {/* Social */}
            <div className="flex gap-4">
              <a href="#" className="hover:underline">YouTube</a>
              <a href="#" className="hover:underline">Facebook</a>
              <a href="#" className="hover:underline">Instagram</a>
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
