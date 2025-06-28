import React, { useState, useEffect } from 'react'

export const Button = ({ children, type = 'button', className = '', disabled = false, onClick, loading = false }) => (
  <button
    type={type}
    disabled={disabled || loading}
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium text-gray-900 bg-amber-400 rounded-md hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  >
    {loading ? 'Loading...' : children}
  </button>
)

export const FormGroup = ({ children, className = '' }) => (
  <div className={`space-y-4 ${className}`}>
    {children}
  </div>
)

export const FormField = ({ label, error, children, required = false }) => (
  <div>
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    {children}
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
)

export const Input = ({ type = 'text', className = '', ...props }) => (
  <input
    type={type}
    className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-400 focus:ring focus:ring-amber-200 focus:ring-opacity-50 sm:text-sm ${className}`}
    {...props}
  />
)

export const FormActions = ({ children, className = '' }) => (
  <div className={`flex items-center justify-end space-x-2 pt-4 border-t border-gray-200 ${className}`}>
    {children}
  </div>
)

const Form = ({ onSubmit, initialData, fields }) => {
  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    } else {
      // Initialize form data with default values
      const defaultData = {}
      fields.forEach(field => {
        if (field.type === 'checkbox') {
          defaultData[field.name] = field.defaultChecked || false
        } else {
          defaultData[field.name] = field.defaultValue || ''
        }
      })
      setFormData(defaultData)
    }
  }, [initialData, fields])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate required fields
    const newErrors = {}
    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name}>
          <label 
            htmlFor={field.name}
            className="block text-sm font-medium text-gray-700"
          >
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </label>

          {field.type === 'checkbox' ? (
            <div className="mt-1">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name={field.name}
                  checked={formData[field.name] || false}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-amber-400 shadow-sm focus:border-amber-400 focus:ring focus:ring-amber-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-600">
                  {field.description}
                </span>
              </label>
            </div>
          ) : field.type === 'textarea' ? (
            <textarea
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleChange}
              placeholder={field.placeholder}
              rows={field.rows || 4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-400 focus:ring focus:ring-amber-200 focus:ring-opacity-50 sm:text-sm"
            />
          ) : field.type === 'select' ? (
            <select
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-400 focus:ring focus:ring-amber-200 focus:ring-opacity-50 sm:text-sm"
            >
              <option value="">{field.placeholder || 'Select an option'}</option>
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleChange}
              placeholder={field.placeholder}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-400 focus:ring focus:ring-amber-200 focus:ring-opacity-50 sm:text-sm"
            />
          )}

          {errors[field.name] && (
            <p className="mt-1 text-sm text-red-600">
              {errors[field.name]}
            </p>
          )}
        </div>
      ))}

      <div className="pt-4 border-t border-gray-200">
        <button
          type="submit"
          className="w-full px-4 py-2 text-sm font-medium text-gray-900 bg-amber-400 rounded-md hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400"
        >
          Save Changes
        </button>
      </div>
    </form>
  )
}

export default Form 