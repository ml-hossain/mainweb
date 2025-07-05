import React, { useState, useRef } from 'react'
import { FiUpload, FiCheck, FiX } from 'react-icons/fi'

const CompactFileUpload = ({ onContentParsed, currentContent = '' }) => {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const parseJSONContent = (data) => {
    try {
      const parsed = JSON.parse(data)
      let htmlContent = ''

      if (parsed.title) {
        htmlContent += `<h1>${parsed.title}</h1>\n`
      }

      if (parsed.sections && Array.isArray(parsed.sections)) {
        parsed.sections.forEach(section => {
          if (section.heading) {
            htmlContent += `<h2>${section.heading}</h2>\n`
          }
          if (section.content) {
            htmlContent += `${section.content}\n\n`
          }
        })
      } else if (parsed.content) {
        htmlContent += parsed.content
      } else {
        Object.keys(parsed).forEach(key => {
          if (key !== 'title') {
            htmlContent += `<h2>${key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()}</h2>\n`
            htmlContent += `<p>${parsed[key]}</p>\n\n`
          }
        })
      }

      return htmlContent
    } catch (error) {
      throw new Error('Invalid JSON format')
    }
  }

  const parseCSVContent = (data) => {
    try {
      const lines = data.trim().split('\n')
      if (lines.length < 2) {
        throw new Error('CSV must have at least a header and one data row')
      }

      let htmlContent = ''

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
        
        if (values.length >= 2) {
          const sectionTitle = values[0]
          const sectionContent = values[1]
          
          htmlContent += `<h2>${sectionTitle}</h2>\n`
          htmlContent += `${sectionContent}\n\n`
        }
      }

      return htmlContent
    } catch (error) {
      throw new Error('Invalid CSV format')
    }
  }

  const handleFileInput = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const fileType = file.name.split('.').pop().toLowerCase()
    
    if (!['json', 'csv'].includes(fileType)) {
      setError('Only JSON or CSV files allowed')
      setTimeout(() => setError(''), 3000)
      return
    }

    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const fileContent = await file.text()
      let htmlContent = ''
      
      if (fileType === 'json') {
        htmlContent = parseJSONContent(fileContent)
      } else if (fileType === 'csv') {
        htmlContent = parseCSVContent(fileContent)
      }

      // Append to existing content instead of replacing
      const combinedContent = currentContent ? `${currentContent}\n\n${htmlContent}` : htmlContent
      onContentParsed(combinedContent)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      
      // Clear the input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err) {
      setError(err.message || 'Error processing file')
      setTimeout(() => setError(''), 3000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.csv"
        onChange={handleFileInput}
        className="hidden"
      />
      
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
        className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
        title="Import from JSON/CSV file"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
        ) : success ? (
          <FiCheck className="w-5 h-5 text-green-600" />
        ) : error ? (
          <FiX className="w-5 h-5 text-red-600" />
        ) : (
          <FiUpload className="w-5 h-5" />
        )}
      </button>
      
      {/* Minimal error tooltip */}
      {error && (
        <div className="absolute top-full left-0 mt-1 px-2 py-1 bg-red-100 text-red-600 text-xs rounded whitespace-nowrap z-10">
          {error}
        </div>
      )}
    </div>
  )
}

export default CompactFileUpload
