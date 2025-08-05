'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { sessionDb } from '@/lib/db';
import { Session } from '@/lib/types/database';

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadSessions();
  }, []);

  async function loadSessions() {
    try {
      const data = await sessionDb.getAll();
      setSessions(data || []);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  }

  function toggleSessionExpansion(sessionId: string) {
    setExpandedSessions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sessionId)) {
        newSet.delete(sessionId);
      } else {
        newSet.add(sessionId);
      }
      return newSet;
    });
  }

  async function handleDeleteSession(sessionId: string, sessionQuestion: string) {
    if (!confirm(`Are you sure you want to delete the session "${sessionQuestion}"? This cannot be undone.`)) {
      return;
    }

    try {
      await sessionDb.delete(sessionId);
      setSessions(sessions.filter(s => s.id !== sessionId));
      setExpandedSessions(prev => {
        const newSet = new Set(prev);
        newSet.delete(sessionId);
        return newSet;
      });
    } catch (error) {
      console.error('Error deleting session:', error);
      alert('Failed to delete session');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">Loading sessions...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
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
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Session History</h1>
              <p className="text-gray-600">Total Sessions: {sessions.length}</p>
            </div>
            <Link
              href="/session/new"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              New Session
            </Link>
          </div>
        </div>

        {sessions.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No sessions yet</h2>
            <p className="text-gray-600 mb-6">Create your first lightning round session to get started.</p>
            <Link
              href="/session/new"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create First Session
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => {
              const isExpanded = expandedSessions.has(session.id);
              const answersWithEmployee = session.answers?.filter(answer => answer.employee) || [];
              const participantCount = answersWithEmployee.length;
              const answeredCount = answersWithEmployee.filter(answer => answer.answer).length;

              return (
                <div key={session.id} className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h2 className="text-xl font-semibold text-gray-900">
                            {session.question}
                          </h2>
                          {session.asked_by && (
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                              Asked by {session.asked_by}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <span>{new Date(session.created_at).toLocaleDateString()}</span>
                          <span>{participantCount} participants</span>
                          <span>{answeredCount} responses</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            session.completed_at 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {session.completed_at ? 'Completed' : 'In Progress'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleSessionExpansion(session.id)}
                          className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          {isExpanded ? 'Collapse' : 'Expand'}
                        </button>
                        <Link
                          href={`/session/${session.id}`}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => handleDeleteSession(session.id, session.question)}
                          className="px-4 py-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="p-6">
                      {answersWithEmployee.length === 0 ? (
                        <p className="text-gray-500 italic">No responses recorded for this session.</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {answersWithEmployee
                            .sort((a, b) => a.employee!.name.localeCompare(b.employee!.name))
                            .map((answer) => (
                              <div key={answer.id} className="border border-gray-200 rounded-lg p-4">
                                <h4 className="font-medium text-gray-900 mb-2">
                                  {answer.employee!.name}
                                </h4>
                                <p className="text-gray-700 text-sm">
                                  {answer.answer || <span className="italic text-gray-400">No response</span>}
                                </p>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}