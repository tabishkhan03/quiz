'use client';
import { useEffect, useState } from 'react';
import { FaTrophy, FaMedal, FaUser, FaCrown, FaChartLine } from 'react-icons/fa';

export default function Leaderboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        setLoading(true);
        const res = await fetch('/api/leaderboard');
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || `Server responded with ${res.status}`);
        }
        
        const json = await res.json();
        setData(json.data || []);
        setError(null);
      } catch (err) {
        console.error('Leaderboard fetch error:', err);
        setError(err.message || 'Failed to load leaderboard. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchLeaderboard();
  }, []);

  function getRankIcon(rank) {
    switch (rank) {
      case 1:
        return <FaCrown className="text-yellow-500" size={26} />;
      case 2:
        return <FaMedal className="text-gray-400" size={24} />;
      case 3:
        return <FaMedal className="text-amber-700" size={24} />;
      default:
        return (
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-600 font-medium">
            {rank}
          </div>
        );
    }
  }

  function formatEmail(email) {
    if (!email) return '-';
    return email;
  }

  function formatName(name, email) {
    if (name) return name;
    if (email) return email.split('@')[0];
    return 'User';
  }

  function getScoreColor(score, index) {
    if (index === 0) return 'text-yellow-500';
    if (index === 1) return 'text-gray-500';
    if (index === 2) return 'text-amber-700';
    return score > 80 ? 'text-green-600' : score > 50 ? 'text-blue-600' : 'text-indigo-600';
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <div className="w-12 h-12 border-t-4 border-indigo-600 border-solid rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 font-medium">Loading leaderboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-center">
        <div className="flex flex-col items-center">
          <div className="text-red-500 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Unable to load leaderboard</h3>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="text-gray-300 mb-4">
          <FaTrophy size={64} />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">No Rankings Yet</h3>
        <p className="text-gray-600 max-w-sm mx-auto">
          Complete quizzes to get on the leaderboard! Your score will be calculated based on your quiz performances.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <FaChartLine className="text-indigo-600" size={24} />
          <h2 className="text-2xl font-bold text-gray-800">Leaderboard</h2>
        </div>
        <p className="text-gray-600">Top performers based on quiz scores</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Top 3 users on mobile */}
        <div className="md:hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white">
            <h3 className="font-semibold text-center">Top Performers</h3>
          </div>
          <div className="flex justify-around p-6 pb-8 bg-gray-50">
            {data.slice(0, 3).map((user, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`relative mb-3 ${index === 0 ? 'transform scale-110 -mt-1' : ''}`}>
                  <div className={`w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-md ${
                    index === 0 ? 'ring-4 ring-yellow-400' : index === 1 ? 'ring-2 ring-gray-300' : 'ring-2 ring-amber-600'
                  }`}>
                    <FaUser size={index === 0 ? 32 : 28} className={
                      index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : 'text-amber-700'
                    } />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow">
                    {getRankIcon(index + 1)}
                  </div>
                </div>
                <p className="font-medium text-gray-800 text-center">
                  {formatName(user.name, user.email)}
                </p>
                <p className={`font-bold ${getScoreColor(user.totalScore, index)}`}>
                  {user.totalScore} pts
                </p>
              </div>
            ))}
          </div>
        </div>
      
        {/* Table view for all users */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="hidden md:table-cell px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((user, index) => (
                <tr 
                  key={index}
                  className={`
                    hover:bg-gray-50 transition-colors
                    ${index < 3 ? 'bg-opacity-50' : ''}
                    ${index === 0 ? 'bg-yellow-50' : ''}
                    ${index === 1 ? 'bg-gray-50' : ''}
                    ${index === 2 ? 'bg-amber-50' : ''}
                  `}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center">
                      {getRankIcon(index + 1)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3 text-indigo-700 font-bold">
                        {formatName(user.name, user.email).charAt(0).toUpperCase()}
                      </div>
                      <div className="font-medium text-gray-800">
                        {formatName(user.name, user.email)}
                      </div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-gray-600">
                    {formatEmail(user.email)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className={`font-bold text-lg ${getScoreColor(user.totalScore, index)}`}>
                      {user.totalScore}
                      <span className="text-xs ml-1 text-gray-500">pts</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-500' : index === 2 ? 'bg-amber-700' : 'bg-indigo-600'}`}
                        style={{ width: `${Math.min(100, (user.totalScore / (data[0]?.totalScore || 100)) * 100)}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
