import React, { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { FiPlus, FiEdit2, FiTrash2, FiArrowUp, FiArrowDown } from 'react-icons/fi'
import Modal from '../../components/Modal'
import Form from '../../components/Form'

const Navigation = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  useEffect(() => {
    fetchNavigationItems()
  }, [])

  const fetchNavigationItems = async () => {
    try {
      const { data, error } = await supabase
        .from('navigation_items')
        .select('*')
        .order('order_index', { ascending: true })

      if (error) throw error

      setItems(data || [])
    } catch (error) {
      console.error('Error fetching navigation items:', error)
      setError('Failed to load navigation items')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingItem(null)
    setShowModal(true)
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this navigation item?')) return

    try {
      const { error } = await supabase
        .from('navigation_items')
        .delete()
        .eq('id', id)

      if (error) throw error

      setItems(items.filter(item => item.id !== id))
    } catch (error) {
      console.error('Error deleting navigation item:', error)
      alert('Failed to delete navigation item')
    }
  }

  const handleSubmit = async (formData) => {
    try {
      if (editingItem) {
        const { error } = await supabase
          .from('navigation_items')
          .update({
            label: formData.label,
            url: formData.url,
            is_active: formData.is_active
          })
          .eq('id', editingItem.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('navigation_items')
          .insert([{
            label: formData.label,
            url: formData.url,
            order_index: items.length + 1,
            is_active: formData.is_active
          }])

        if (error) throw error
      }

      setShowModal(false)
      fetchNavigationItems()
    } catch (error) {
      console.error('Error saving navigation item:', error)
      alert('Failed to save navigation item')
    }
  }

  const handleReorder = async (id, direction) => {
    const currentIndex = items.findIndex(item => item.id === id)
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === items.length - 1)
    ) return

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    const newItems = [...items]
    const [movedItem] = newItems.splice(currentIndex, 1)
    newItems.splice(newIndex, 0, movedItem)

    // Update order_index for all items
    try {
      const updates = newItems.map((item, index) => ({
        id: item.id,
        order_index: index + 1
      }))

      const { error } = await supabase
        .from('navigation_items')
        .upsert(updates)

      if (error) throw error

      setItems(newItems)
    } catch (error) {
      console.error('Error reordering navigation items:', error)
      alert('Failed to reorder navigation items')
      fetchNavigationItems() // Refresh the list on error
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchNavigationItems}
          className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Navigation Management</h1>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-amber-400 text-gray-900 rounded-lg hover:bg-amber-500 flex items-center"
        >
          <FiPlus className="mr-2" />
          Add Item
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Label
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                URL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.label}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.url}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    item.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleReorder(item.id, 'up')}
                      disabled={items.indexOf(item) === 0}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                      <FiArrowUp />
                    </button>
                    <button
                      onClick={() => handleReorder(item.id, 'down')}
                      disabled={items.indexOf(item) === items.length - 1}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                      <FiArrowDown />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-amber-400 hover:text-amber-500"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-400 hover:text-red-500"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingItem ? 'Edit Navigation Item' : 'Add Navigation Item'}
      >
        <Form
          onSubmit={handleSubmit}
          initialData={editingItem}
          fields={[
            {
              name: 'label',
              label: 'Label',
              type: 'text',
              required: true,
              placeholder: 'Enter menu item label'
            },
            {
              name: 'url',
              label: 'URL',
              type: 'text',
              required: true,
              placeholder: 'Enter URL (e.g., /about)'
            },
            {
              name: 'is_active',
              label: 'Active',
              type: 'checkbox',
              defaultChecked: true
            }
          ]}
        />
      </Modal>
    </div>
  )
}

export default Navigation 