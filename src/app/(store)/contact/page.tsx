'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        setSubmitted(true)
        setFormData({ name: '', email: '', phone: '', message: '' })
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-12">
      <h1 className="text-6xl text-center mb-12 bg-gradient-to-r from-yellow-300 via-pink-300 to-green-300 bg-clip-text text-transparent animate-glow">
        Contact Us
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Info */}
        <div className="space-y-6">
          <div className="p-6 bg-white/10 rounded-2xl backdrop-blur border border-white/20">
            <h3 className="text-2xl font-bold text-yellow-300 mb-4">📍 Address</h3>
            <p className="text-white/80">123 Hardware Street<br />Shop #45, Market Area<br />City, State 12345</p>
          </div>
          <div className="p-6 bg-white/10 rounded-2xl backdrop-blur border border-white/20">
            <h3 className="text-2xl font-bold text-green-300 mb-4">📞 Phone</h3>
            <p className="text-white/80">Main: +92 300 1234567<br />WhatsApp: +92 300 1234567</p>
          </div>
          <div className="p-6 bg-white/10 rounded-2xl backdrop-blur border border-white/20">
            <h3 className="text-2xl font-bold text-blue-300 mb-4">✉️ Email</h3>
            <p className="text-white/80">sajidsyed@gmail.com</p>
          </div>
        </div>

        {/* Form */}
        {submitted ? (
          <div className="p-8 bg-green-500/20 rounded-2xl backdrop-blur border border-green-500 text-center">
            <h3 className="text-3xl text-green-300 mb-4">Thank You! 🙏</h3>
            <p className="text-white">We'll get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              placeholder="Your Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white"
            />
            <input
              type="email"
              placeholder="Your Email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white"
            />
            <textarea
              placeholder="Your Message"
              required
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white"
            />
            <button
              type="submit"
              className="w-full px-8 py-4 text-xl rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white glow-button"
            >
              Send Message 📨
            </button>
          </form>
        )}
      </div>
    </div>
  )
}