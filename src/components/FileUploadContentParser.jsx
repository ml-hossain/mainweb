import React, { useState, useRef } from 'react'
import { FiUpload, FiFile, FiX, FiCheck, FiAlertCircle, FiDownload } from 'react-icons/fi'

const FileUploadContentParser = ({ onContentParsed, currentContent = '' }) => {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const fileInputRef = useRef(null)

  // Sample JSON structure for reference
  const sampleJSON = {
    "title": "University of Example",
    "sections": [
      {
        "heading": "About the University",
        "content": "<p>Detailed information about the university...</p>"
      },
      {
        "heading": "Academic Programs",
        "content": "<ul><li>Computer Science</li><li>Business Administration</li></ul>"
      },
      {
        "heading": "Admission Requirements",
        "content": "<p>Requirements for admission...</p>"
      }
    ]
  }

  // Sample CSV structure for reference
  const sampleCSV = `Section,Content
About the University,"<p>Detailed information about the university...</p>"
Academic Programs,"<ul><li>Computer Science</li><li>Business Administration</li></ul>"
Admission Requirements,"<p>Requirements for admission...</p>"`

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (selectedFile) => {
    const fileType = selectedFile.name.split('.').pop().toLowerCase()
    
    if (!['json', 'csv'].includes(fileType)) {
      setError('Please upload only JSON or CSV files')
      return
    }

    setFile(selectedFile)
    setError('')
    setSuccess('')
  }

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
        // Simple content structure
        htmlContent += parsed.content
      } else {
        // If no structured format, convert object to readable format
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

      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
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

  const processFile = async () => {
    if (!file) return

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const fileContent = await file.text()
      const fileType = file.name.split('.').pop().toLowerCase()
      
      let htmlContent = ''
      
      if (fileType === 'json') {
        htmlContent = parseJSONContent(fileContent)
      } else if (fileType === 'csv') {
        htmlContent = parseCSVContent(fileContent)
      }

      onContentParsed(htmlContent)
      setSuccess(`Successfully parsed ${fileType.toUpperCase()} file and updated content!`)
      setFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err) {
      setError(err.message || 'Error processing file')
    } finally {
      setLoading(false)
    }
  }

  const downloadSampleJSON = () => {
    const dataStr = JSON.stringify(sampleJSON, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'university-content-sample.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const downloadSampleCSV = () => {
    const dataBlob = new Blob([sampleCSV], { type: 'text/csv' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'university-content-sample.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const clearFile = () => {
    setFile(null)
    setError('')
    setSuccess('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="border border-gray-200 rounded-2xl p-6 bg-gray-50">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Content File</h3>
        <p className="text-sm text-gray-600 mb-4">
          Upload a JSON or CSV file to automatically populate the university content. This will replace the current content.
        </p>

        {/* Sample Files Download */}
        <div className="flex gap-3 mb-4">
          <button
            type="button"
            onClick={downloadSampleJSON}
            className="flex items-center px-3 py-2 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <FiDownload className="w-3 h-3 mr-1" />
            Download Sample JSON
          </button>
          <button
            type="button"
            onClick={downloadSampleCSV}
            className="flex items-center px-3 py-2 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
          >
            <FiDownload className="w-3 h-3 mr-1" />
            Download Sample CSV
          </button>
        </div>
      </div>

      {/* File Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${
          dragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,.csv"
          onChange={handleFileInput}
          className="hidden"
        />

        {!file ? (
          <div>
            <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Drop your JSON or CSV file here
            </p>
            <p className="text-sm text-gray-500 mb-4">
              or click to browse files
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Files
            </button>
          </div>
        ) : (
          <div>
            <FiFile className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              {file.name}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              {(file.size / 1024).toFixed(2)} KB
            </p>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={processFile}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <FiCheck className="w-4 h-4 mr-2" />
                )}
                {loading ? 'Processing...' : 'Parse & Apply'}
              </button>
              <button
                type="button"
                onClick={clearFile}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <FiX className="w-4 h-4 mr-2" />
                Remove
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mt-4 flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
          <FiAlertCircle className="w-5 h-5 text-red-600 mr-2" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="mt-4 flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
          <FiCheck className="w-5 h-5 text-green-600 mr-2" />
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      {/* Format Guidelines */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2">JSON Format</h4>
          <pre className="text-xs text-gray-600 bg-gray-50 p-2 rounded overflow-x-auto">
{`{
  "title": "University Name",
  "sections": [
    {
      "heading": "Section Title",
      "content": "<p>HTML content</p>"
    }
  ]
}`}
          </pre>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2">CSV Format</h4>
          <pre className="text-xs text-gray-600 bg-gray-50 p-2 rounded overflow-x-auto">
{`Section,Content
"About","<p>University info</p>"
"Programs","<ul><li>Course 1</li></ul>"`}
          </pre>
        </div>
      </div>
    </div>
  )
}

export default FileUploadContentParser
