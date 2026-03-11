import Image from 'next/image'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with Bismillah */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-arabic bg-gradient-to-r from-yellow-300 via-pink-300 to-green-300 bg-clip-text text-transparent animate-glow mb-4">
            ﷽
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
            About Us
          </h2>
        </div>

        {/* Admin Information Card */}
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-3xl p-8 mb-12 backdrop-blur border border-white/20">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Admin Image Placeholder */}
            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-purple-500 shadow-2xl">
              <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-6xl">
                👤
              </div>
            </div>

            {/* Admin Info */}
            <div className="text-center md:text-left">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Hafiz Sajid Syed
              </h3>
              <p className="text-xl text-purple-300 mb-4">Founder & Chief Administrator</p>
              
              <div className="space-y-2 text-white/80">
                <p className="flex items-center justify-center md:justify-start gap-2">
                  <span className="text-2xl">📧</span>
                  <a href="mailto:sajidsyed@gmail.com" className="hover:text-purple-300">
                    sajidsyed@gmail.com
                  </a>
                </p>
                <p className="flex items-center justify-center md:justify-start gap-2">
                  <span className="text-2xl">📞</span>
                  <a href="tel:+923001234567" className="hover:text-purple-300">
                    +92 300 1234567
                  </a>
                </p>
                <p className="flex items-center justify-center md:justify-start gap-2">
                  <span className="text-2xl">📍</span>
                  <span>123 Hardware Street, Shop #45, City</span>
                </p>
              </div>

              {/* Social Links */}
              <div className="flex gap-4 mt-6 justify-center md:justify-start">
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-2xl hover:bg-white/20">
                  📘
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-2xl hover:bg-white/20">
                  📷
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-2xl hover:bg-white/20">
                  🐦
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/5 rounded-2xl p-8 backdrop-blur border border-white/10">
            <h3 className="text-2xl font-bold text-yellow-300 mb-4 flex items-center gap-2">
              <span className="text-3xl">📖</span> Our Story
            </h3>
            <p className="text-white/70 leading-relaxed">
              Founded in <span className="text-white font-bold">1995</span> by Hafiz Sajid Syed, 
              our hardware store has grown from a small shop to a trusted name in the community. 
              With over <span className="text-white font-bold">30 years</span> of experience, 
              we provide quality hardware solutions with integrity and excellence.
            </p>
          </div>

          <div className="bg-white/5 rounded-2xl p-8 backdrop-blur border border-white/10">
            <h3 className="text-2xl font-bold text-green-300 mb-4 flex items-center gap-2">
              <span className="text-3xl">🎯</span> Our Mission
            </h3>
            <p className="text-white/70 leading-relaxed">
              To provide the highest quality hardware products while ensuring customer safety 
              and satisfaction. We believe in building lasting relationships with our customers 
              through trust and reliability.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-white/5 rounded-2xl p-8 backdrop-blur border border-white/10 mb-12">
          <h3 className="text-2xl font-bold text-blue-300 mb-6 text-center">Our Core Values</h3>
          <div className="grid md:grid-cols-4 gap-4">
            {values.map((value, index) => (
              <div key={index} className="text-center p-4">
                <div className="text-4xl mb-2">{value.icon}</div>
                <h4 className="text-white font-bold mb-1">{value.title}</h4>
                <p className="text-white/50 text-sm">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 text-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-white">{stat.number}</div>
              <div className="text-white/50 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Health & Safety Importance */}
        <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-3xl p-8 mb-12">
          <h3 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-300 mb-8">
            Importance of Health & Safety
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 rounded-xl p-6">
              <div className="text-4xl mb-3">🛡️</div>
              <h4 className="text-xl font-bold text-green-300 mb-2">Safety First</h4>
              <p className="text-white/70 text-sm">
                All our products meet international safety standards and come with proper safety guidelines.
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-6">
              <div className="text-4xl mb-3">💪</div>
              <h4 className="text-xl font-bold text-blue-300 mb-2">Quality Materials</h4>
              <p className="text-white/70 text-sm">
                We source only the highest quality, non-toxic materials safe for you and your family.
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-6">
              <div className="text-4xl mb-3">🌱</div>
              <h4 className="text-xl font-bold text-purple-300 mb-2">Eco-Friendly</h4>
              <p className="text-white/70 text-sm">
                Committed to environmental health with sustainable products and practices.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-xl font-bold glow-button"
          >
            Contact Us Today 📞
          </Link>
          <p className="text-white/50 mt-4 text-sm">
            We're here to help with all your hardware needs
          </p>
        </div>
      </div>
    </div>
  )
}

// Values data
const values = [
  { icon: '⭐', title: 'Quality', desc: 'Premium products only' },
  { icon: '🤝', title: 'Trust', desc: '30+ years of service' },
  { icon: '💡', title: 'Expertise', desc: 'Knowledgeable staff' },
  { icon: '❤️', title: 'Care', desc: 'Customer first approach' },
]

// Stats data
const stats = [
  { icon: '📦', number: '10,000+', label: 'Products' },
  { icon: '👥', number: '5,000+', label: 'Happy Customers' },
  { icon: '⭐', number: '30+', label: 'Years Experience' },
  { icon: '🏆', number: '50+', label: 'Awards Won' },
]