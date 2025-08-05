'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { employeeDb, sessionDb, answerDb } from '@/lib/db';
import { Employee } from '@/lib/types/database';

export default function NewSessionPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [question, setQuestion] = useState('');
  const [askedBy, setAskedBy] = useState('');
  const [currentEmployeeIndex, setCurrentEmployeeIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEmployees();
  }, []);

  async function loadEmployees() {
    try {
      const data = await employeeDb.getAll();
      setEmployees(data || []);
      // Pre-select all employees
      setSelectedEmployees((data || []).map(emp => emp.id));
    } catch (err) {
      console.error('Error loading employees:', err);
      setError('Failed to load employees');
    }
  }

  function handleEmployeeToggle(employeeId: string) {
    setSelectedEmployees(prev =>
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  }

  function handleNextStep() {
    if (step === 1) {
      if (selectedEmployees.length === 0) {
        alert('Please select at least one employee');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!question.trim()) {
        alert('Please enter a question');
        return;
      }
      setStep(3);
    }
  }

  function handlePreviousStep() {
    if (step > 1) {
      setStep(step - 1);
    }
  }

  function handleAnswerSubmit() {
    const currentEmployee = getSelectedEmployees()[currentEmployeeIndex];
    setAnswers(prev => ({
      ...prev,
      [currentEmployee.id]: currentAnswer.trim()
    }));
    setCurrentAnswer('');
    
    if (currentEmployeeIndex < getSelectedEmployees().length - 1) {
      setCurrentEmployeeIndex(currentEmployeeIndex + 1);
    } else {
      // All answers collected, save session
      handleSaveSession();
    }
  }

  function handleSkipAnswer() {
    const currentEmployee = getSelectedEmployees()[currentEmployeeIndex];
    setAnswers(prev => ({
      ...prev,
      [currentEmployee.id]: ''
    }));
    
    if (currentEmployeeIndex < getSelectedEmployees().length - 1) {
      setCurrentEmployeeIndex(currentEmployeeIndex + 1);
    } else {
      // All answers collected, save session
      handleSaveSession();
    }
  }

  async function handleSaveSession() {
    setLoading(true);
    try {
      // Create the session
      const session = await sessionDb.create(question.trim(), askedBy.trim() || undefined);
      
      // Prepare answers for batch insert
      const answersData = getSelectedEmployees().map(employee => ({
        session_id: session.id,
        employee_id: employee.id,
        answer: answers[employee.id] || null
      }));
      
      // Save all answers
      await answerDb.createBatch(answersData);
      
      // Mark session as complete
      await sessionDb.complete(session.id);
      
      // Redirect to session detail
      router.push(`/session/${session.id}`);
    } catch (err) {
      console.error('Error saving session:', err);
      setError('Failed to save session');
      setLoading(false);
    }
  }

  function getSelectedEmployees() {
    return employees.filter(emp => selectedEmployees.includes(emp.id));
  }

  const selectedEmployeesList = getSelectedEmployees();
  const currentEmployee = selectedEmployeesList[currentEmployeeIndex];

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/" className="text-blue-600 hover:text-blue-500">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">New Lightning Round Session</h1>
          
          {/* Progress indicator - only show for steps 1 and 2 */}
          {step < 3 && (
            <div className="flex items-center justify-between mb-6">
              <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}>
                  1
                </span>
                <span className="ml-2">Select Employees</span>
              </div>
              <div className="flex-1 h-px bg-gray-300 mx-4"></div>
              <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}>
                  2
                </span>
                <span className="ml-2">Enter Question</span>
              </div>
              <div className="flex-1 h-px bg-gray-300 mx-4"></div>
              <div className={`flex items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}>
                  3
                </span>
                <span className="ml-2">Collect Answers</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow">
          {/* Step 1: Select Employees */}
          {step === 1 && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Select Participating Employees ({selectedEmployees.length} selected)
              </h2>
              
              <div className="mb-4 flex gap-4">
                <button
                  onClick={() => setSelectedEmployees(employees.map(emp => emp.id))}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Select All
                </button>
                <button
                  onClick={() => setSelectedEmployees([])}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Select None
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
                {employees.map((employee) => (
                  <label
                    key={employee.id}
                    className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedEmployees.includes(employee.id)}
                      onChange={() => handleEmployeeToggle(employee.id)}
                      className="mr-3"
                    />
                    <span className="text-sm">{employee.name}</span>
                  </label>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleNextStep}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Enter Question */}
          {step === 2 && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Enter Question</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question *
                </label>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g., What's your favorite movie?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asked by (optional)
                </label>
                <input
                  type="text"
                  value={askedBy}
                  onChange={(e) => setAskedBy(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-between">
                <button
                  onClick={handlePreviousStep}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={handleNextStep}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start Collecting Answers
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Collect Answers */}
          {step === 3 && currentEmployee && (
            <div className="p-0">
              {/* Full-width progress header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Collecting Answers
                  </h2>
                  <span className="text-sm text-gray-500">
                    {currentEmployeeIndex + 1} of {selectedEmployeesList.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${((currentEmployeeIndex + 1) / selectedEmployeesList.length) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{question}</h3>
                  {askedBy && <p className="text-gray-600">Asked by {askedBy}</p>}
                </div>

                <div className="text-center mb-6">
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">
                    {currentEmployee.name}
                  </h4>
                  
                  <textarea
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="Enter answer..."
                    className="w-full max-w-md mx-auto px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    autoFocus
                  />
                </div>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleSkipAnswer}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Skip
                  </button>
                  <button
                    onClick={handleAnswerSubmit}
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {currentEmployeeIndex === selectedEmployeesList.length - 1 
                      ? (loading ? 'Saving...' : 'Finish Session')
                      : 'Next'
                    }
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}