'use client';
import { useEffect, useState } from 'react';
import { FaUser, FaTrophy, FaHistory, FaMedal, FaCrown, FaEnvelope, FaIdCard, FaCalendarAlt, FaEdit, FaExclamationTriangle } from 'react-icons/fa';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalAttempts: 0,
    averageScore: 0,
    topScore: 0,
    completedQuizzes: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    async function fetchUserData() {
      try {
        // Fetch user profile
        const userRes = await fetch('/api/auth/me', {
          credentials: 'include'
        });
        if (!userRes.ok) throw new Error('Failed to fetch user info');
        
        const userData = await userRes.json();
        if (!userData.loggedIn) {
          setError('You are not logged in.');
          setLoading(false);
          return;
        }
        
        setUser(userData.user);
        
        // Fetch user stats from attempts
        try {
          const statsRes = await fetch('/api/attempts/stats', {
            credentials: 'include'
          });
          
          if (statsRes.ok) {
            const statsData = await statsRes.json();
            setStats(statsData.data || {
              totalAttempts: 0,
              averageScore: 0,
              topScore: 0,
              completedQuizzes: 0
            });
          }
        } catch (statsErr) {
          console.error('Could not load stats:', statsErr);
          // Don't fail completely if stats don't load
        }
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

  function getInitials(name) {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  }
  
  function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mb-4"></div>
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <FaExclamationTriangle className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-gray-800 mb-6">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="relative h-48 bg-gradient-to-r from-indigo-500 to-purple-600">
            <div className="absolute -bottom-16 left-8">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden">
                <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600">
                  <FaUser className="w-16 h-16" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-20 pb-6 px-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
                <p className="text-gray-600">{user.email}</p>
              </div>
              <button className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200">
                <FaEdit className="mr-2" /> Edit Profile
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 mb-3">
                  <FaHistory className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold text-gray-800">{stats.totalAttempts}</div>
                <div className="text-sm text-gray-600">Attempts</div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 mb-3">
                  <FaTrophy className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold text-gray-800">{stats.completedQuizzes}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 mb-3">
                  <FaMedal className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold text-gray-800">{stats.topScore}%</div>
                <div className="text-sm text-gray-600">Top Score</div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 mb-3">
                  <FaCrown className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold text-gray-800">{stats.averageScore}%</div>
                <div className="text-sm text-gray-600">Average</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <div className="flex space-x-8">
                <button 
                  className={`pb-4 px-1 font-medium text-sm border-b-2 transition-colors duration-200 ${
                    activeTab === 'profile'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('profile')}
                >
                  Profile
                </button>
                <button 
                  className={`pb-4 px-1 font-medium text-sm border-b-2 transition-colors duration-200 ${
                    activeTab === 'account'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('account')}
                >
                  Account Details
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-8">
              {activeTab === 'profile' ? (
                <>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">About Me</h2>
                    <p className="text-gray-600">
                      {user.bio || "No bio information available."}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
                    {stats.totalAttempts > 0 ? (
                      <div className="space-y-2">
                        <p className="text-gray-600">
                          You've completed {stats.completedQuizzes} quizzes with an average score of {stats.averageScore}%.
                        </p>
                        <p className="text-gray-600">Keep up the good work!</p>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-600 mb-2">You haven't attempted any quizzes yet.</p>
                        <p className="text-gray-600">Start taking quizzes to build your profile stats!</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h2>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <FaEnvelope className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm text-gray-500">Email</div>
                        <div className="text-gray-800">{user.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaIdCard className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm text-gray-500">User ID</div>
                        <div className="text-gray-800">{user._id}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaCalendarAlt className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm text-gray-500">Member Since</div>
                        <div className="text-gray-800">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
