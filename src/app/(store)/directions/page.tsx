export default function DirectionsPage() {
  return (
    <div className="max-w-4xl mx-auto py-12">
      <h1 className="text-6xl text-center mb-12 bg-gradient-to-r from-yellow-300 via-pink-300 to-green-300 bg-clip-text text-transparent animate-glow">
        Directions
      </h1>

      <div className="space-y-8">
        {/* Map */}
        <div className="h-96 bg-white/10 rounded-2xl backdrop-blur border border-white/20 flex items-center justify-center">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3618.888888888888!2d67.123456!3d24.888888!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDUzJzIwLjAiTiA2N8KwMDcnMjAuMCJF!5e0!3m2!1sen!2s!4v1234567890"
            width="100%"
            height="100%"
            style={{ border: 0, borderRadius: '1rem' }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>

        {/* Directions */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-white/10 rounded-2xl backdrop-blur border border-white/20">
            <h3 className="text-2xl font-bold text-yellow-300 mb-4">🚗 By Car</h3>
            <p className="text-white/80">
              From City Center, take Main Boulevard towards North. Turn right at the second traffic signal. 
              We're located in the Hardware Market complex, Shop #45.
            </p>
          </div>
          <div className="p-6 bg-white/10 rounded-2xl backdrop-blur border border-white/20">
            <h3 className="text-2xl font-bold text-green-300 mb-4">🚌 By Bus</h3>
            <p className="text-white/80">
              Take any bus going to Central Market. Get off at Hardware Market stop. 
              We're a 2-minute walk from the bus stop.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}