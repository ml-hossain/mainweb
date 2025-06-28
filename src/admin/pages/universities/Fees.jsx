import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAdmin } from '../../context/AdminContext';
import Modal, { ConfirmationModal } from '../../components/Modal';
import {
  FormGroup,
  FormField,
  Input,
  TextArea,
  Select,
  Button,
  ButtonGroup,
  FormActions,
  Badge
} from '../../components/Form';
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

function Fees() {
  const { isAdmin } = useAdmin();
  const [fees, setFees] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    university_id: '',
    program_id: '',
    amount: '',
    currency: 'USD',
    fee_type: '',
    is_mandatory: true,
    payment_schedule: '',
    notes: ''
  });

  useEffect(() => {
    fetchFees();
    fetchUniversities();
  }, []);

  useEffect(() => {
    if (formData.university_id) {
      fetchPrograms(formData.university_id);
    } else {
      setPrograms([]);
    }
  }, [formData.university_id]);

  async function fetchFees() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('fees')
        .select(`
          *,
          university:universities (
            name
          ),
          program:programs (
            name
          )
        `)
        .order('name');

      if (error) throw error;
      setFees(data || []);
    } catch (error) {
      console.error('Error fetching fees:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchUniversities() {
    try {
      const { data, error } = await supabase
        .from('universities')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setUniversities(data || []);
    } catch (error) {
      console.error('Error fetching universities:', error);
    }
  }

  async function fetchPrograms(universityId) {
    try {
      const { data, error } = await supabase
        .from('programs')
        .select('id, name')
        .eq('university_id', universityId)
        .order('name');

      if (error) throw error;
      setPrograms(data || []);
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  }

  const filteredFees = fees.filter(fee =>
    fee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fee.university?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fee.program?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fee.fee_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const { user } = await supabase.auth.getUser();
      const feeData = {
        ...formData,
        updated_by: user.id
      };

      if (selectedFee) {
        const { error } = await supabase
          .from('fees')
          .update(feeData)
          .eq('id', selectedFee.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('fees')
          .insert([{ ...feeData, created_by: user.id }]);
        if (error) throw error;
      }

      setShowAddModal(false);
      setSelectedFee(null);
      setFormData({
        name: '',
        description: '',
        university_id: '',
        program_id: '',
        amount: '',
        currency: 'USD',
        fee_type: '',
        is_mandatory: true,
        payment_schedule: '',
        notes: ''
      });
      fetchFees();
    } catch (error) {
      console.error('Error saving fee:', error);
    }
  }

  async function handleDelete() {
    if (!selectedFee) return;

    try {
      const { error } = await supabase
        .from('fees')
        .delete()
        .eq('id', selectedFee.id);

      if (error) throw error;

      setShowDeleteModal(false);
      setSelectedFee(null);
      fetchFees();
    } catch (error) {
      console.error('Error deleting fee:', error);
    }
  }

  function handleEdit(fee) {
    setSelectedFee(fee);
    setFormData({
      name: fee.name,
      description: fee.description || '',
      university_id: fee.university_id || '',
      program_id: fee.program_id || '',
      amount: fee.amount || '',
      currency: fee.currency || 'USD',
      fee_type: fee.fee_type || '',
      is_mandatory: fee.is_mandatory ?? true,
      payment_schedule: fee.payment_schedule || '',
      notes: fee.notes || ''
    });
    setShowAddModal(true);
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const feeTypes = [
    'Tuition',
    'Application',
    'Registration',
    'Laboratory',
    'Library',
    'Technology',
    'Student Services',
    'Health Insurance',
    'Housing',
    'Other'
  ];

  const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];

  const paymentSchedules = [
    'One-time',
    'Per Semester',
    'Per Year',
    'Monthly',
    'Quarterly',
    'Custom'
  ];

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Fees</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage fees and charges for universities and programs.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Button
            onClick={() => {
              setSelectedFee(null);
              setFormData({
                name: '',
                description: '',
                university_id: '',
                program_id: '',
                amount: '',
                currency: 'USD',
                fee_type: '',
                is_mandatory: true,
                payment_schedule: '',
                notes: ''
              });
              setShowAddModal(true);
            }}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Fee
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mt-6 mb-4 flex gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search fees..."
          />
        </div>

        <Button
          variant="secondary"
          onClick={fetchFees}
        >
          <ArrowPathIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Fees List */}
      <div className="mt-4 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Fee
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      University
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Program
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Type
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Amount
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Schedule
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredFees.map((fee) => (
                    <tr key={fee.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="flex items-center">
                          <div>
                            <div className="font-medium text-gray-900">{fee.name}</div>
                            {fee.is_mandatory && (
                              <Badge variant="red" className="mt-1">Mandatory</Badge>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {fee.university?.name || '-'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {fee.program?.name || '-'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <Badge variant="gray">
                          {fee.fee_type}
                        </Badge>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {fee.amount ? (
                          `${fee.currency} ${parseFloat(fee.amount).toLocaleString()}`
                        ) : '-'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {fee.payment_schedule || '-'}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <ButtonGroup>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleEdit(fee)}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                          {isAdmin && (
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => {
                                setSelectedFee(fee);
                                setShowDeleteModal(true);
                              }}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          )}
                        </ButtonGroup>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedFee(null);
        }}
        title={selectedFee ? 'Edit Fee' : 'Add New Fee'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormGroup>
            <FormField label="Fee Name" required>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </FormField>

            <FormField label="Description">
              <TextArea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </FormField>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField label="University" required>
                <Select
                  value={formData.university_id}
                  onChange={(e) => setFormData({ ...formData, university_id: e.target.value, program_id: '' })}
                  required
                >
                  <option value="">Select a university</option>
                  {universities.map((university) => (
                    <option key={university.id} value={university.id}>
                      {university.name}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField label="Program">
                <Select
                  value={formData.program_id}
                  onChange={(e) => setFormData({ ...formData, program_id: e.target.value })}
                  disabled={!formData.university_id}
                >
                  <option value="">Select a program</option>
                  {programs.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.name}
                    </option>
                  ))}
                </Select>
              </FormField>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <FormField label="Amount" required>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  min="0"
                  step="0.01"
                  required
                />
              </FormField>

              <FormField label="Currency">
                <Select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                >
                  {currencies.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField label="Fee Type" required>
                <Select
                  value={formData.fee_type}
                  onChange={(e) => setFormData({ ...formData, fee_type: e.target.value })}
                  required
                >
                  <option value="">Select fee type</option>
                  {feeTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Select>
              </FormField>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField label="Payment Schedule">
                <Select
                  value={formData.payment_schedule}
                  onChange={(e) => setFormData({ ...formData, payment_schedule: e.target.value })}
                >
                  <option value="">Select schedule</option>
                  {paymentSchedules.map((schedule) => (
                    <option key={schedule} value={schedule}>
                      {schedule}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField label="Is Mandatory">
                <Select
                  value={formData.is_mandatory.toString()}
                  onChange={(e) => setFormData({ ...formData, is_mandatory: e.target.value === 'true' })}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </Select>
              </FormField>
            </div>

            <FormField label="Additional Notes">
              <TextArea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                placeholder="Any additional information about the fee"
              />
            </FormField>
          </FormGroup>

          <FormActions>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowAddModal(false);
                setSelectedFee(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              {selectedFee ? 'Save Changes' : 'Add Fee'}
            </Button>
          </FormActions>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedFee(null);
        }}
        onConfirm={handleDelete}
        title="Delete Fee"
      >
        <p className="text-sm text-gray-500">
          Are you sure you want to delete {selectedFee?.name}? This action cannot be undone.
        </p>
      </ConfirmationModal>
    </div>
  );
}

export default Fees;