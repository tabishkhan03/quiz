'use client';
import { useState, useEffect } from 'react';
import { FaClock, FaArrowLeft, FaCheck, FaTimes, FaExclamationTriangle } from 'react-icons/fa';

export default function QuizTaker({ quizId, onBack, onComplete }) {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch quiz details
  useEffect(() => {
    async function fetchQuiz() {
      setLoading(true);
      try {
        const res = await fetch(`/api/quiz/${quizId}`);
        if (!res.ok) throw new Error('Failed to fetch quiz');
        
        const data = await res.json();
        setQuiz(data.data);
        
        // Initialize the answers array with null values for each question
        setUserAnswers(new Array(data.data.questions.length).fill(null));
        
        // Set the timer
        setTimeLeft(data.data.timeLimit * 60); // Convert minutes to seconds
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchQuiz();
  }, [quizId]);

  // Timer effect
  useEffect(() => {
    if (!timeLeft || timeLeft <= 0) return;

    const timerId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (timeLeft === 0 && quiz) {
      handleSubmit();
    }
  }, [timeLeft]);

  function handleOptionSelect(optionIndex) {
    setSelectedOption(optionIndex);
  }

  function handleNextQuestion() {
    if (selectedOption === null) return;

    // Save the answer
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = selectedOption;
    setUserAnswers(newAnswers);
    
    // Move to next question or submit
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      handleSubmit();
    }
  }

  function handlePrevQuestion() {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      // Restore previous answer if exists
      setSelectedOption(userAnswers[currentQuestion - 1]);
    }
  }

  async function handleSubmit() {
    if (submitting) return;
    
    // Make sure all questions are answered
    const finalAnswers = [...userAnswers];
    if (selectedOption !== null) {
      finalAnswers[currentQuestion] = selectedOption;
    }
    
    // Check if all questions are answered
    const unansweredQuestions = finalAnswers.includes(null);
    if (unansweredQuestions && timeLeft > 0) {
      if (!confirm('You have unanswered questions. Are you sure you want to submit?')) {
        return;
      }
    }

    setSubmitting(true);
    
    try {
      const res = await fetch('/api/attempts/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId: quiz._id,
          answers: finalAnswers,
        }),
      });
      
      if (!res.ok) throw new Error('Failed to submit quiz');
      
      const data = await res.json();
      setResults(data.data);
      setShowResults(true);

      // Notify parent component if provided
      if (onComplete) {
        onComplete(data.data);
      }
    } catch (err) {
      setError(`Error submitting quiz: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mb-4"></div>
        <p className="text-gray-600">Loading quiz...</p>
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
          <button 
            onClick={onBack} 
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            <FaArrowLeft className="mr-2" /> Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Quiz Completed!</h2>
          
          <div className="bg-gray-50 rounded-lg overflow-hidden mb-6">
            <div className="bg-indigo-600 text-white py-3 px-4 text-center font-semibold">Results</div>
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-indigo-600 mb-2">
                  {results.score}/{results.total}
                </div>
                <div className="text-xl text-gray-600">
                  {Math.round((results.score / results.total) * 100)}%
                </div>
              </div>
              
              <div className="text-center text-gray-700">
                {results.score === results.total ? (
                  <p className="text-lg font-medium">Perfect score! Excellent work! 🎉</p>
                ) : results.score >= results.total * 0.7 ? (
                  <p className="text-lg font-medium">Great job! You did well! 👏</p>
                ) : results.score >= results.total * 0.5 ? (
                  <p className="text-lg font-medium">Good effort! Keep practicing! 💪</p>
                ) : (
                  <p className="text-lg font-medium">Don't give up! Try again after reviewing the material. 📚</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <button 
              onClick={onBack} 
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              <FaArrowLeft className="mr-2" /> Back to Quizzes
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz) return null;

  const currentQuestionData = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <button 
                onClick={onBack} 
                className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                <FaArrowLeft className="mr-2" />
                <span>Back to Quizzes</span>
              </button>
              <div className="flex items-center text-gray-600">
                <FaClock className="mr-2" />
                <span className={timeLeft < 60 ? 'text-red-500 font-medium' : ''}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">{quiz.title}</h2>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-600 mt-2">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </div>
            </div>

            <div className="mb-8">
              <div className="text-lg font-medium text-gray-800 mb-6">
                {currentQuestionData.questionText}
              </div>

              <div className="space-y-3">
                {currentQuestionData.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(index)}
                    className={`w-full p-4 text-left rounded-lg border transition-all duration-200 ${
                      selectedOption === index
                        ? 'border-indigo-500 bg-indigo-50'
                        : userAnswers[currentQuestion] === index && selectedOption !== index
                        ? 'border-gray-300 bg-gray-50'
                        : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 mr-3">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <div className="flex-grow">{option}</div>
                      {selectedOption === index && (
                        <div className="flex-shrink-0 text-indigo-600">
                          <FaCheck />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              {currentQuestion > 0 && (
                <button 
                  onClick={handlePrevQuestion}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Previous
                </button>
              )}
              
              <button 
                onClick={handleNextQuestion} 
                disabled={selectedOption === null}
                className={`ml-auto px-4 py-2 rounded-lg transition-colors duration-200 ${
                  selectedOption === null
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {currentQuestion < quiz.questions.length - 1 ? 'Next' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 