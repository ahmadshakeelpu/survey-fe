'use client'

import { useState } from 'react'
import { type AttariData } from '@/lib/api'

interface AttariQuestionnaireProps {
  attariData: AttariData | null
  setAttariData: (data: AttariData) => void
  onComplete: () => void
}

const ATTARI_QUESTIONS = [
  {
    id: 'attari_1',
    text: 'AI will make this world a better place.',
    facet: 'Cognitive',
    valence: 'Positive'
  },
  {
    id: 'attari_2',
    text: 'I have strong negative emotions about AI.',
    facet: 'Affective',
    valence: 'Negative (reverse coded)'
  },
  {
    id: 'attari_3',
    text: 'I want to use technologies that rely on AI.',
    facet: 'Behavioral',
    valence: 'Positive'
  },
  {
    id: 'attari_4',
    text: 'AI has more disadvantages than advantages.',
    facet: 'Cognitive',
    valence: 'Negative (reverse coded)'
  },
  {
    id: 'attari_5',
    text: 'I look forward to future AI developments.',
    facet: 'Affective',
    valence: 'Positive'
  },
  {
    id: 'attari_6',
    text: 'AI offers solutions to many world problems.',
    facet: 'Cognitive',
    valence: 'Positive'
  },
  {
    id: 'attari_7',
    text: 'I prefer technologies that do not feature AI.',
    facet: 'Behavioral',
    valence: 'Negative (reverse coded)'
  },
  {
    id: 'attari_8',
    text: 'I am afraid of AI.',
    facet: 'Affective',
    valence: 'Negative (reverse coded)'
  },
  {
    id: 'attari_9',
    text: 'I would rather choose a technology with AI than one without.',
    facet: 'Behavioral',
    valence: 'Positive'
  },
  {
    id: 'attari_10',
    text: 'AI creates problems rather than solving them.',
    facet: 'Cognitive',
    valence: 'Negative (reverse coded)'
  },
  {
    id: 'attari_11',
    text: 'When I think about AI, I have mostly positive feelings.',
    facet: 'Affective',
    valence: 'Positive'
  },
  {
    id: 'attari_12',
    text: 'I would rather avoid technologies that are based on AI.',
    facet: 'Behavioral',
    valence: 'Negative (reverse coded)'
  }
]

export default function AttariQuestionnaire({ attariData, setAttariData, onComplete }: AttariQuestionnaireProps) {
  const [responses, setResponses] = useState<AttariData>(attariData || {})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setAttariData(responses)
    onComplete()
  }

  const handleResponseChange = (questionId: string, value: number) => {
    setResponses(prev => ({ ...prev, [questionId]: value }))
  }

  const isComplete = ATTARI_QUESTIONS.every(q => responses[q.id] !== undefined)

  return (
    <div className="card max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Attitudes Towards AI</h1>
        <p className="text-gray-600">Please rate your agreement with the following statements</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">Instructions:</h3>
        <p className="text-blue-800 text-sm">
          In the following, we are interested in your attitudes towards artificial intelligence (AI). 
          AI can execute tasks that typically require human intelligence. It enables machines to sense, 
          act, learn, and adapt in an autonomous, human-like way. AI may be part of a computer or 
          online platform but it can also be encountered in various other hardware devices such as robots.
        </p>
        <p className="text-blue-800 text-sm mt-2">
          Please rate each statement on a scale from 1 (strongly disagree) to 5 (strongly agree).
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {ATTARI_QUESTIONS.map((question, index) => (
          <div key={question.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <span className="text-sm font-medium text-gray-500">Question {index + 1}</span>
              <div className="text-xs text-gray-500">
                <span className="bg-gray-100 px-2 py-1 rounded">{question.facet}</span>
                <span className="ml-2 bg-gray-100 px-2 py-1 rounded">{question.valence}</span>
              </div>
            </div>
            
            <p className="text-gray-800 mb-4 font-medium">{question.text}</p>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Strongly disagree</span>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex flex-col items-center cursor-pointer">
                    <input
                      type="radio"
                      name={question.id}
                      value={value}
                      checked={responses[question.id] === value}
                      onChange={(e) => handleResponseChange(question.id, parseInt(e.target.value))}
                      className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 mt-1">{value}</span>
                  </label>
                ))}
              </div>
              <span className="text-sm text-gray-600">Strongly agree</span>
            </div>
          </div>
        ))}

        <div className="pt-6">
          <button 
            type="submit" 
            disabled={!isComplete || isSubmitting}
            className={`w-full py-4 rounded-lg font-medium transition-all duration-200 ${
              isComplete && !isSubmitting
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg active:scale-95' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? 'Processing...' : 'Continue to TAI Questionnaire'}
          </button>
        </div>
      </form>
    </div>
  )
}
