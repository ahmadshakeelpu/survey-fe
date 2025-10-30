'use client'

interface PreRandomizationPageProps {
  onComplete: () => void
}

export default function PreRandomizationPage({ onComplete }: PreRandomizationPageProps) {
  return (
    <div className="card max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Next Section: Conversation</h1>
        <div className="w-16 h-1 bg-primary-600 mx-auto rounded mb-4"></div>
      </div>

      <div className="prose max-w-none mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-blue-900 mb-3">What to Expect:</h3>
          <p className="text-blue-800 mb-4">
            In the next part of the study, you will have a short, computer-assisted conversation.
          </p>
          
          <ul className="text-blue-800 space-y-2">
            <li>• The interview consists of <strong>three rounds</strong>, in each of which you will be asked a few questions</li>
            <li>• Please answer in the way that suits you personally – there are <strong>no right or wrong answers</strong></li>
            <li>• The conversation lasts only a few minutes in total</li>
            <li>• Once the three rounds of interviews have been completed, you will be automatically redirected to the next part of the study</li>
          </ul>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">Important Notes:</h3>
          <ul className="text-gray-700 space-y-1">
            <li>• You will be talking to an AI assistant</li>
            <li>• The conversation will be tailored based on your previous responses</li>
            <li>• Feel free to express your thoughts and concerns openly</li>
            <li>• You can take your time to think about your responses</li>
          </ul>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={onComplete}
          className="btn-primary px-8 py-3 text-lg"
        >
          Start Conversation
        </button>
      </div>
    </div>
  )
}
