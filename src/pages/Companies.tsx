import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { CompanyList } from '../components/companies/CompanyList';
import { CompanyForm } from '../components/companies/CompanyForm';
import { getCompanies, setCompanies } from '../services/storage';
import type { Company } from '../types';

export function Companies() {
  const [companies, setCompaniesState] = useState<Company[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | undefined>();

  // Load companies on component mount
  useEffect(() => {
    const storedCompanies = getCompanies();
    setCompaniesState(storedCompanies);
  }, []);

  const handleSubmit = (data: Partial<Company>) => {
    let updatedCompanies: Company[];
    
    if (editingCompany) {
      // Update existing company
      updatedCompanies = companies.map(c => 
        c.id === editingCompany.id ? { ...editingCompany, ...data } : c
      );
    } else {
      // Create new company
      const newCompany: Company = {
        id: Date.now().toString(),
        createdAt: new Date(),
        masterUserId: undefined,
        ...data,
      } as Company;
      updatedCompanies = [...companies, newCompany];
    }
    
    // Update state and persist to storage
    setCompaniesState(updatedCompanies);
    setCompanies(updatedCompanies);
    handleCancel();
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      const updatedCompanies = companies.filter(c => c.id !== id);
      setCompaniesState(updatedCompanies);
      setCompanies(updatedCompanies);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCompany(undefined);
  };

  const handleAssignMaster = (company: Company) => {
    // This will be implemented in the next step with user management
    console.log('Assign master to company:', company.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Companies</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Company
          </button>
        )}
      </div>

      {showForm ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {editingCompany ? 'Edit' : 'New'} Company
          </h2>
          <CompanyForm
            company={editingCompany}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <CompanyList
            companies={companies}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAssignMaster={handleAssignMaster}
          />
        </div>
      )}
    </div>
  );
}