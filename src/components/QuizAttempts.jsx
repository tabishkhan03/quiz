'use client';
import { useEffect, useState } from 'react';
import { FaTrophy, FaClock, FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaChartBar, FaInfoCircle, FaExclamationCircle } from 'react-icons/fa';

export default function QuizAttempts() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAttempts() {
      try {
        const res = await fetch('/api/attempts/history');
        if (!res.ok) throw new Error('Failed to fetch attempts');
        const json = await res.json();
        setAttempts(json.data || []);
      } catch (err) {
        console.error(err);
        setError("Could not load your quiz attempts. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchAttempts();
  }, []);

  function getProgressColor(percent) {
    if (percent >= 90) return 'bg-green-500'; // Green
    if (percent >= 70) return 'bg-blue-500'; // Blue
    if (percent >= 50) return 'bg-yellow-500'; // Yellow
    return 'bg-red-500'; // Red
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 font-medium">Loading your quiz attempts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl p-6 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center mb-3">
          <FaExclamationCircle className="text-red-500 mr-3 flex-shrink-0" size={24} />
          <h3 className="text-lg font-semibold text-red-800">Error Loading Attempts</h3>
        </div>
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Quiz Attempts</h2>
        <p className="text-gray-500">Track your progress and see how you've performed on quizzes</p>
      </div>
      
      {attempts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center max-w-xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-6">
            <FaTrophy className="h-8 w-8 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Attempts Yet</h3>
          <p className="text-gray-600 mb-6">You haven't attempted any quizzes yet. Go to the Quizzes section to get started!</p>
          <button className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors duration-200">
            <FaChartBar className="mr-2" />
            Browse Quizzes
          </button>
        </div>
      ) : (
        <div>
          {/* Stats summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-sm p-6 text-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Total Attempts</h3>
                <div className="p-2 bg-white bg-opacity-30 rounded-lg">
                  <FaChartBar className="h-5 w-5" />
                </div>
              </div>
              <p className="text-3xl font-bold">{attempts.length}</p>
              <p className="text-sm mt-2 text-blue-100">Your quiz participation</p>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-sm p-6 text-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Average Score</h3>
                <div className="p-2 bg-white bg-opacity-30 rounded-lg">
                  <FaCheckCircle className="h-5 w-5" />
                </div>
              </div>
              <p className="text-3xl font-bold">
                {attempts.length > 0 
                  ? `${Math.round(attempts.reduce((sum, attempt) => sum + (attempt.score / attempt.total) * 100, 0) / attempts.length)}%` 
                  : "N/A"}
              </p>
              <p className="text-sm mt-2 text-green-100">Your typical performance</p>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg shadow-sm p-6 text-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Recent Activity</h3>
                <div className="p-2 bg-white bg-opacity-30 rounded-lg">
                  <FaCalendarAlt className="h-5 w-5" />
                </div>
              </div>
              <p className="text-3xl font-bold">
                {attempts.length > 0 
                  ? new Date(Math.max(...attempts.map(a => new Date(a.submittedAt)))).toLocaleDateString() 
                  : "None"}
              </p>
              <p className="text-sm mt-2 text-purple-100">Last quiz attempt date</p>
            </div>
          </div>

          {/* Attempts list */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="border-b border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quiz</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attempts.map((attempt, i) => {
                    const scorePercent = Math.round((attempt.score / attempt.total) * 100);
                    const isPassing = scorePercent >= 70;
                    
                    return (
                      <tr key={i} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                              {attempt.quizTitle?.charAt(0) || 'Q'}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{attempt.quizTitle}</div>
                              <div className="text-sm text-gray-500">{attempt.total} questions</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{new Date(attempt.submittedAt).toLocaleDateString()}</div>
                          <div className="text-xs text-gray-500">{new Date(attempt.submittedAt).toLocaleTimeString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{attempt.score}/{attempt.total}</div>
                          <div className="text-xs text-gray-500">{scorePercent}% correct</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            isPassing ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {isPassing ? 
                              <FaCheckCircle className="mr-1.5 h-3 w-3" /> : 
                              <FaTimesCircle className="mr-1.5 h-3 w-3" />
                            }
                            {isPassing ? 'Passed' : 'Failed'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className={`h-2.5 rounded-full ${getProgressColor(scorePercent)}`}
                              style={{ width: `${scorePercent}%` }}
                            ></div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile view for smaller screens */}
          <div className="md:hidden mt-4 space-y-4">
            {attempts.map((attempt, i) => {
              const scorePercent = Math.round((attempt.score / attempt.total) * 100);
              const isPassing = scorePercent >= 70;
              
              return (
                <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-900">{attempt.quizTitle}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isPassing ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {isPassing ? 'Passed' : 'Failed'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between">
                      <div className="text-sm text-gray-500">Score</div>
                      <div className="text-sm font-medium">{attempt.score}/{attempt.total} ({scorePercent}%)</div>
                    </div>
                    
                    <div className="flex justify-between">
                      <div className="text-sm text-gray-500">Date</div>
                      <div className="text-sm font-medium">{new Date(attempt.submittedAt).toLocaleDateString()}</div>
                    </div>
                    
                    <div className="flex justify-between">
                      <div className="text-sm text-gray-500">Time</div>
                      <div className="text-sm font-medium">{new Date(attempt.submittedAt).toLocaleTimeString()}</div>
                    </div>
                    
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${getProgressColor(scorePercent)}`}
                        style={{ width: `${scorePercent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
