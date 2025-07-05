export default function Loading() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F4F6F8' }}>
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        {/* Organization Image with Rotating Dial */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F4F6F8' }}>
            <div className="w-16 h-16 border-4 border-transparent rounded-full animate-spin" style={{ borderTopColor: '#34A853' }}></div>
          </div>
        </div>

        {/* Heading */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold" style={{ color: '#0A66C2' }}>
            Loading...
          </h1>
        </div>
      </div>
    </main>
  )
}
