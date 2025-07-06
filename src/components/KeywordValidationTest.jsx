import React, { useState } from 'react'
import { FiSearch, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi'

const KeywordValidationTest = () => {
  const [testKeyword, setTestKeyword] = useState('')
  const [testResult, setTestResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const testKeywordAPI = async () => {
    if (!testKeyword.trim()) {
      setTestResult({
        type: 'error',
        message: 'Please enter a keyword to test'
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/keywords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keyword: testKeyword.trim(),
          country: 'BD',
          language: 'en',
          location: 'Dhaka, Bangladesh'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setTestResult({
          type: 'error',
          message: data.message || data.error || 'API call failed',
          details: data
        })
      } else {
        setTestResult({
          type: 'success',
          message: 'Keyword API working correctly for Bangladesh market',
          details: data
        })
      }
    } catch (error) {
      setTestResult({
        type: 'error',
        message: 'Network error: ' + error.message
      })
    } finally {
      setLoading(false)
    }
  }

  const testCases = [
    { keyword: '', expected: 'Should reject empty keyword' },
    { keyword: 'the', expected: 'Should reject stop word' },
    { keyword: 'a', expected: 'Should reject single character' },
    { keyword: 'university admission', expected: 'Should accept education keyword' },
    { keyword: 'business consultant', expected: 'Should accept business keyword' },
    { keyword: 'IELTS preparation Bangladesh', expected: 'Should accept specific keyword' }
  ]

  const runTestCase = async (testCase) => {
    setTestKeyword(testCase.keyword)
    await new Promise(resolve => setTimeout(resolve, 100)) // Small delay for UI update
    await testKeywordAPI()
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mr-3">
          <FiSearch className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Keyword API Test</h3>
          <p className="text-gray-600 text-sm">Test Bangladesh market keyword validation</p>
        </div>
      </div>

      {/* Manual Test Input */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Test Keyword
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={testKeyword}
              onChange={(e) => setTestKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && testKeywordAPI()}
              placeholder="Enter keyword to test..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={testKeywordAPI}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test'}
            </button>
          </div>
        </div>

        {/* Test Result */}
        {testResult && (
          <div className={`p-4 rounded-xl border ${
            testResult.type === 'success' 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start space-x-2">
              {testResult.type === 'success' ? (
                <FiCheck className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              ) : (
                <FiX className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className={`font-medium ${
                  testResult.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {testResult.message}
                </p>
                {testResult.details && (
                  <details className="mt-2">
                    <summary className="text-sm cursor-pointer text-gray-600 hover:text-gray-800">
                      View API Response
                    </summary>
                    <pre className="mt-2 text-xs bg-gray-100 p-3 rounded-lg overflow-auto max-h-60">
                      {JSON.stringify(testResult.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Predefined Test Cases */}
      <div>
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
          <FiAlertCircle className="w-4 h-4 mr-2" />
          Quick Test Cases
        </h4>
        <div className="space-y-2">
          {testCases.map((testCase, index) => (
            <button
              key={index}
              onClick={() => runTestCase(testCase)}
              disabled={loading}
              className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-800">
                  "{testCase.keyword || '(empty)'}"
                </span>
                <span className="text-sm text-gray-600">
                  {testCase.expected}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Usage Guidelines */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <h4 className="font-semibold text-blue-800 mb-2">Usage Guidelines</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Keywords must be at least 2 characters long</li>
          <li>• Avoid common stop words like "the", "and", "or"</li>
          <li>• Include specific terms like university names, courses, or services</li>
          <li>• API targets Bangladesh market with local variations</li>
          <li>• Education and business keywords get additional suggestions</li>
        </ul>
      </div>
    </div>
  )
}

export default KeywordValidationTest
