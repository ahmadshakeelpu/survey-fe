'use client'

import { useState } from 'react'

interface ScreeningPageProps {
  screeningText: string
  setScreeningText: (text: string) => void
  baselineUse: number
  setBaselineUse: (value: number) => void
  onComplete: () => void
}

export default function ScreeningPage({ 
  screeningText, 
  setScreeningText, 
  baselineUse, 
  setBaselineUse, 
  onComplete 
}: ScreeningPageProps) {
  const [isValid, setIsValid] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isValid) {
      onComplete()
    }
  }

  const handleScreeningChange = (value: string) => {
    setScreeningText(value)
    // Check if user answered "no" (exclusion criterion)
    const isExcluded = value.trim().toLowerCase() === 'no'
    setIsValid(!isExcluded && value.trim().length > 0)
  }

  return (
    <div className="card max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Screening Questions</h1>
        <p className="text-gray-600">Please answer the following questions honestly</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Screening Question */}
        <div>
          <label className="form-label">
            Concerns about AI in Recruitment
          </label>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-yellow-800 text-sm">
              <strong>Important:</strong> Some people see opportunities in the use of AI, others have more concerns. 
              Are there aspects that make you skeptical or that would make you feel uncomfortable if AI were 
              to be included in the recruitment process?
            </p>
          </div>
          <textarea
            value={screeningText}
            onChange={(e) => handleScreeningChange(e.target.value)}
            className="form-input h-32 resize-none"
            placeholder="Please elaborate on what your concerns are. If you have no concerns, please answer 'no'"
            required
          />
          {screeningText.trim().toLowerCase() === 'no' && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">
                <strong>Note:</strong> If you have no concerns, you will be excluded from the main study 
                as we are specifically interested in people who have concerns about AI in recruitment.
              </p>
            </div>
          )}
        </div>

        {/* Baseline Question */}
        <div>
          <label className="form-label">
            Baseline Assessment: Likelihood to Use AI for Recruiting
          </label>
          <p className="text-sm text-gray-600 mb-4">
            How likely are you to use AI-based tools for recruiting staff?
          </p>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-700">0%</span>
              <span className="text-lg font-bold text-primary-600">{baselineUse}%</span>
              <span className="text-sm font-medium text-gray-700">100%</span>
            </div>
            
            <input
              type="range"
              min="0"
              max="100"
              value={baselineUse}
              onChange={(e) => setBaselineUse(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${baselineUse}%, #e5e7eb ${baselineUse}%, #e5e7eb 100%)`
              }}
            />
            
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Not likely at all</span>
              <span>Very likely</span>
            </div>
          </div>
        </div>

        <div className="pt-6">
          <button 
            type="submit" 
            disabled={!isValid}
            className={`w-full py-3 rounded-lg font-medium transition-colors duration-200 ${
              isValid 
                ? 'btn-primary' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue to Conversation
          </button>
        </div>
      </form>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  )
}
