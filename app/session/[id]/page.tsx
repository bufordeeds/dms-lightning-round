'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { sessionDb } from '@/lib/db';
import { Session } from '@/lib/types/database';

export default function SessionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      loadSession(params.id as string);
    }
  }, [params.id]);

  async function loadSession(id: string) {
    try {
      const data = await sessionDb.getById(id);
      setSession(data);
    } catch (err) {
      console.error('Error loading session:', err);
      setError('Session not found');
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteSession() {
    if (!session || !confirm('Are you sure you want to delete this session? This cannot be undone.')) {
      return;
    }

    try {
      await sessionDb.delete(session.id);
      router.push('/sessions');
    } catch (err) {
      console.error('Error deleting session:', err);
      alert('Failed to delete session');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">Loading session...</div>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Session Not Found</h1>
            <Link href="/" className="text-blue-600 hover:text-blue-500">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const answersWithEmployee = session.answers?.filter(answer => answer.employee) || [];
  const participantCount = answersWithEmployee.length;
  const answeredCount = answersWithEmployee.filter(answer => answer.answer).length;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
            <button
              onClick={handleDeleteSession}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete Session
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{session.question}</h1>
            {session.asked_by && (
              <p className="text-lg text-gray-600 mb-4">Asked by {session.asked_by}</p>
            )}
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div>
                <span className="font-medium">Date:</span> {new Date(session.created_at).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Participants:</span> {participantCount}
              </div>
              <div>
                <span className="font-medium">Responses:</span> {answeredCount} of {participantCount}
              </div>
              <div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  session.completed_at 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {session.completed_at ? 'Completed' : 'In Progress'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Responses</h2>
          </div>
          
          {answersWithEmployee.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No responses recorded for this session.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {answersWithEmployee
                .sort((a, b) => a.employee!.name.localeCompare(b.employee!.name))
                .map((answer) => (
                  <div key={answer.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {answer.employee!.name}
                        </h3>
                        <div className="text-gray-700">
                          {answer.answer ? (
                            <p className="text-base">{answer.answer}</p>
                          ) : (
                            <p className="text-gray-400 italic">No response</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/sessions"
            className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            View All Sessions
          </Link>
        </div>
      </div>
    </div>
  );
}