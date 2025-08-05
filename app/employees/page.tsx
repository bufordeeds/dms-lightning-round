'use client';

import { useState, useEffect } from 'react';
import { employeeDb } from '@/lib/db';
import { Employee } from '@/lib/types/database';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmployees();
  }, []);

  async function loadEmployees() {
    try {
      const data = await employeeDb.getAll();
      setEmployees(data || []);
    } catch (error) {
      console.error('Error loading employees:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddEmployee(e: React.FormEvent) {
    e.preventDefault();
    if (!newEmployeeName.trim()) return;

    try {
      const newEmployee = await employeeDb.create(newEmployeeName.trim());
      setEmployees([...employees, newEmployee].sort((a, b) => a.name.localeCompare(b.name)));
      setNewEmployeeName('');
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  }

  async function handleUpdateEmployee(id: string) {
    if (!editingName.trim()) return;

    try {
      const updated = await employeeDb.update(id, editingName.trim());
      setEmployees(employees.map(e => e.id === id ? updated : e).sort((a, b) => a.name.localeCompare(b.name)));
      setEditingId(null);
      setEditingName('');
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  }

  async function handleDeleteEmployee(id: string) {
    if (!confirm('Are you sure you want to delete this employee?')) return;

    try {
      await employeeDb.delete(id);
      setEmployees(employees.filter(e => e.id !== id));
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">Loading employees...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Employee Management</h1>
          <p className="text-gray-600">Total Employees: {employees.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow mb-6">
          <form onSubmit={handleAddEmployee} className="p-6 border-b">
            <div className="flex gap-4">
              <input
                type="text"
                value={newEmployeeName}
                onChange={(e) => setNewEmployeeName(e.target.value)}
                placeholder="Enter employee name"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Employee
              </button>
            </div>
          </form>

          <div className="divide-y">
            {employees.map((employee) => (
              <div key={employee.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                {editingId === employee.id ? (
                  <div className="flex-1 flex gap-4">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                    <button
                      onClick={() => handleUpdateEmployee(employee.id)}
                      className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditingName('');
                      }}
                      className="px-4 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-gray-900">{employee.name}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingId(employee.id);
                          setEditingName(employee.name);
                        }}
                        className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEmployee(employee.id)}
                        className="px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}