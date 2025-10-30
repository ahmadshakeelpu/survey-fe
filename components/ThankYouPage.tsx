'use client'

export default function ThankYouPage() {
  return (
    <div className="card max-w-3xl mx-auto text-center">
      <div className="mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h1>
        <div className="w-16 h-1 bg-primary-600 mx-auto rounded mb-6"></div>
      </div>

      <div className="prose max-w-none mb-8">
        <p className="text-lg text-gray-700 mb-6">
          Thank you for participating in this study!
        </p>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-green-900 mb-3">Study Completion</h3>
          <p className="text-green-800 mb-4">
            Your answers have been successfully saved. By participating, you have made a valuable 
            contribution to psychological research on perceptions and attitudes towards digital 
            forms of interaction.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-blue-900 mb-3">Contact Information</h3>
          <p className="text-blue-800">
            If you have any questions or comments about the study, please feel free to contact us by e-mail:
          </p>
          <p className="text-blue-800 font-medium mt-2">
            <a href="mailto:oliver.thoenen@unifr.ch" className="text-blue-600 hover:text-blue-800 underline">
              oliver.thoenen@unifr.ch
            </a>
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-gray-700">
            Thank you very much for your time and interest!
          </p>
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={() => window.close()}
          className="btn-secondary px-6 py-2"
        >
          Close Study
        </button>
      </div>
    </div>
  )
}
