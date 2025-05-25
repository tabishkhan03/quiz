'use client';

import { useState, useEffect } from 'react';
import { FaClock, FaPlay, FaInfo, FaQuestionCircle, FaStar, FaTags, FaFilter, FaSearch, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';
import QuizTaker from './QuizTaker';

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [refreshAttempts, setRefreshAttempts] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficulty, setDifficulty] = useState('all');

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        const res = await fetch('/api/quiz', { credentials: 'include' });
        if (!res.ok) {
          throw new Error('Failed to fetch quizzes');
        }
        const result = await res.json();
        setQuizzes(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchQuizzes();
  }, [refreshAttempts]);

  function handleStartQuiz(quizId) {
    setActiveQuiz(quizId);
  }

  function handleBackToQuizzes() {
    setActiveQuiz(null);
  }

  function handleQuizComplete() {
    // Refresh the quiz list to update any status indicators
    setRefreshAttempts(prev => prev + 1);
    setActiveQuiz(null);
  }

  // Filter quizzes based on search and filters
  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || quiz.category === categoryFilter;
    const matchesDifficulty = difficulty === 'all' || quiz.difficulty === difficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Get unique categories for the filter dropdown
  const categories = ['all', ...new Set(quizzes.map(quiz => quiz.category || 'uncategorized').filter(Boolean))];
  
  // Get unique difficulties for the filter dropdown
  const difficulties = ['all', ...new Set(quizzes.map(quiz => quiz.difficulty || 'medium').filter(Boolean))];

  if (activeQuiz) {
    return (
      <QuizTaker 
        quizId={activeQuiz} 
        onBack={handleBackToQuizzes} 
        onComplete={handleQuizComplete}
      />
    );
  }

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Available Quizzes</h1>
          <p className="text-gray-500 mt-1">Challenge yourself with our collection of quizzes</p>
        </div>
        
        {/* Search Bar */}
        {/* <div className="relative max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search quizzes..."
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div> */}
      </div>

      {/* Filters */}
      {/* <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap gap-4">
        <div className="flex items-center">
          <FaFilter className="text-gray-400 mr-2" />
          <span className="text-sm font-medium text-gray-700">Filters:</span>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div>
            <label htmlFor="category" className="block text-xs text-gray-500 mb-1">Category</label>
            <select
              id="category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="difficulty" className="block text-xs text-gray-500 mb-1">Difficulty</label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              {difficulties.map(diff => (
                <option key={diff} value={diff}>
                  {diff === 'all' ? 'All Difficulties' : diff.charAt(0).toUpperCase() + diff.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div> */}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">Loading quizzes...</p>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-6">
          <div className="flex items-center">
            <FaExclamationTriangle className="flex-shrink-0 h-5 w-5 text-red-500 mr-3" />
            <p className="text-red-700">Error: {error}</p>
          </div>
          <p className="mt-2 text-sm text-red-600">
            There was a problem loading the quizzes. Please try again later or contact support.
          </p>
        </div>
      )}
      
      {/* Empty State */}
      {!loading && !error && filteredQuizzes.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-500 mb-6">
            <FaInfoCircle className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {searchTerm || categoryFilter !== 'all' || difficulty !== 'all'
              ? "No quizzes match your filters"
              : "No quizzes available yet"}
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {searchTerm || categoryFilter !== 'all' || difficulty !== 'all'
              ? "Try adjusting your search criteria or filters to find more quizzes."
              : "We're working on adding new quizzes soon. Please check back later!"}
          </p>
          {(searchTerm || categoryFilter !== 'all' || difficulty !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
                setDifficulty('all');
              }}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
      
      {/* Quiz Grid */}
      {!loading && !error && filteredQuizzes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => {
            // Extract the difficulty and assign color
            const difficultyColor = {
              easy: 'text-green-600 bg-green-100',
              medium: 'text-orange-600 bg-orange-100',
              hard: 'text-red-600 bg-red-100',
            }[quiz.difficulty || 'medium'];
            
            return (
              <div 
                key={quiz._id} 
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transform transition duration-200 hover:scale-[1.02] hover:shadow-md"
              >
                <div className="p-5 border-b border-gray-100 flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{quiz.title}</h3>
                  {quiz.difficulty && (
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${difficultyColor}`}>
                      {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
                    </span>
                  )}
                </div>
                
                <div className="p-5 flex flex-col h-48">
                  <p className="text-gray-600 text-sm line-clamp-4 mb-4 flex-grow">
                    {quiz.description}
                  </p>
                  
                  <div className="mt-auto">
                    <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <FaClock className="mr-1.5 text-gray-400" />
                        {quiz.timeLimit || '10'} min
                      </div>
                      <div className="flex items-center">
                        <FaQuestionCircle className="mr-1.5 text-gray-400" />
                        {quiz.questions?.length || '0'} questions
                      </div>
                      {quiz.averageRating && (
                        <div className="flex items-center">
                          <FaStar className="mr-1.5 text-yellow-500" />
                          {quiz.averageRating.toFixed(1)}
                        </div>
                      )}
                    </div>
                    
                    {quiz.category && (
                      <div className="mb-4 flex items-center text-xs text-gray-500">
                        <FaTags className="mr-1.5 text-gray-400" />
                        <span className="px-2 py-1 bg-gray-100 rounded-full">
                          {quiz.category}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
                  <button
                    onClick={() => handleStartQuiz(quiz._id)}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors duration-200"
                  >
                    <FaPlay className="text-sm" />
                    Start Quiz
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
