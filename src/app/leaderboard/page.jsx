'use client';
import { useEffect, useState } from 'react';

export default function LeaderboardPage() {
  const [data, setData] = useState([]);
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch('/api/leaderboard');

        if (!res.ok) {
          setError(`Failed to fetch leaderboard: ${res.status} ${res.statusText}`);
          setLoading(false);
          return;
        }

        const text = await res.text();
        if (!text) {
          setError('Empty response from server.');
          setLoading(false);
          return;
        }

        let json;
        try {
          json = JSON.parse(text);
        } catch {
          setError('Invalid JSON response from server.');
          setLoading(false);
          return;
        }

        if (!json.data || !Array.isArray(json.data)) {
          setError('Invalid data format from server.');
          setLoading(false);
          return;
        }

        setData(json.data);

        // Find current user by rank > 10 or fallback to rank 1
        const user = json.data.find(row => row.rank > 10) || json.data.find(row => row.rank === 1);
        if (user) setCurrentUserEmail(user.email);

        setLoading(false);
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
        setError('Unexpected error occurred.');
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  if (loading) return <div className="p-4 text-center text-gray-500">Loading leaderboard...</div>;
  if (error) return <div className="p-4 text-center text-red-600">Error: {error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">🏆 Leaderboard</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-3 border border-gray-200 text-left">Rank</th>
              <th className="py-2 px-3 border border-gray-200 text-left">Name</th>
              <th className="py-2 px-3 border border-gray-200 text-left">Email</th>
              <th className="py-2 px-3 border border-gray-200 text-right">Score</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user, index) => (
              <tr key={index} className={user.email === currentUserEmail ? 'bg-yellow-50 font-semibold' : ''}>
                <td className="py-2 px-3 border border-gray-200">{user.rank}</td>
                <td className="py-2 px-3 border border-gray-200">{user.name}</td>
                <td className="py-2 px-3 border border-gray-200">{user.email}</td>
                <td className="py-2 px-3 border border-gray-200 text-right">{user.totalScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
