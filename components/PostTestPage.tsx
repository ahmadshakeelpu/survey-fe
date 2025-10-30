'use client'

import { useState } from 'react'

interface PostTestPageProps {
  postUse: number
  setPostUse: (value: number) => void
  postChange: string
  setPostChange: (value: string) => void
  onComplete: () => void
}

export default function PostTestPage({ 
  postUse, 
  setPostUse, 
  postChange, 
  setPostChange, 
  onComplete 
}: PostTestPageProps) {
  const [isValid, setIsValid] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isValid) {
      onComplete()
    }
  }

  const handlePostChangeChange = (value: string) => {
    setPostChange(value)
    // Post change is optional per requirements, so always valid
    setIsValid(true)
  }

  return (
    <div className="card max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Post-Conversation Assessment</h1>
        <p className="text-gray-600">Please answer these final questions</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Primary Dependent Variable */}
        <div>
          <label className="form-label">
            Primary Assessment: Likelihood to Use AI for Recruiting
          </label>
          <p className="text-sm text-gray-600 mb-4">
            Now, how likely are you to use AI-based tools for recruiting staff?
          </p>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-700">0%</span>
              <span className="text-lg font-bold text-primary-600">{postUse}%</span>
              <span className="text-sm font-medium text-gray-700">100%</span>
            </div>
            
            <input
              type="range"
              min="0"
              max="100"
              value={postUse}
              onChange={(e) => setPostUse(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${postUse}%, #e5e7eb ${postUse}%, #e5e7eb 100%)`
              }}
            />
            
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Not likely at all</span>
              <span>Very likely</span>
            </div>
          </div>
        </div>

        {/* Secondary Dependent Variable */}
        <div>
          <label className="form-label">
            Secondary Assessment: Change in Concerns
          </label>
          <p className="text-sm text-gray-600 mb-4">
            In one sentence: Did the conversation change anything about your worries/questions? If so, what?
          </p>
          <textarea
            value={postChange}
            onChange={(e) => handlePostChangeChange(e.target.value)}
            className="form-input h-24 resize-none"
            placeholder="Please describe any changes in your thoughts or concerns..."
            required
          />
          <p className="text-xs text-gray-500 mt-1">This question is optional but helps us understand the impact of the conversation.</p>
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
            Complete Study
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
