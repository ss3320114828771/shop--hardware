import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-black/50 backdrop-blur-xl border-t border-white/10 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300 mb-4">
              Hafiz Sajid
            </h3>
            <p className="text-white/70">
              Your trusted hardware store since 1995.
            </p>
          </div>

          <div>
            <h4 className="text-xl font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'Products', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase()}`} className="text-white/70 hover:text-white">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold text-white mb-4">Contact</h4>
            <ul className="space-y-2 text-white/70">
              <li>📍 123 Hardware Street</li>
              <li>📞 +92 300 1234567</li>
              <li>✉️ sajidsyed@gmail.com</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold text-white mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-white/70 hover:text-white text-2xl">📘</a>
              <a href="#" className="text-white/70 hover:text-white text-2xl">📷</a>
              <a href="#" className="text-white/70 hover:text-white text-2xl">🐦</a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-center text-white/50">
          <p>© 2024 Hafiz Sajid Hardware Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}