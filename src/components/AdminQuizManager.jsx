'use client';
import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaEye, FaClock, FaInfoCircle, FaQuestionCircle, FaCheck } from 'react-icons/fa';

export default function AdminQuizManager() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formMode, setFormMode] = useState('create'); // 'create' or 'edit'
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(-1);
  
  // Form state
  const [form, setForm] = useState({ 
    title: '', 
    description: '', 
    timeLimit: '',
    questions: []
  });

  // Question form state
  const [questionForm, setQuestionForm] = useState({
    questionText: '',
    options: ['', ''],
    correctIndex: 0,
    difficulty: 'medium',
    tags: ''
  });

  // UI state
  const [showForm, setShowForm] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [activeTab, setActiveTab] = useState('basic'); // 'basic' or 'questions'

  // Fetch all quizzes for admin management
  useEffect(() => {
    fetchQuizzes();
  }, []);

  async function fetchQuizzes() {
    setLoading(true);
    try {
      const res = await fetch('/api/quiz');
      if (!res.ok) throw new Error('Failed to fetch quizzes');
      const data = await res.json();
      setQuizzes(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Handle quiz form input changes
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Handle question form input changes
  function handleQuestionChange(e) {
    const { name, value } = e.target;
    setQuestionForm({ ...questionForm, [name]: value });
  }

  // Handle option changes
  function handleOptionChange(index, value) {
    const newOptions = [...questionForm.options];
    newOptions[index] = value;
    setQuestionForm({ ...questionForm, options: newOptions });
  }

  // Add new option field
  function addOption() {
    if (questionForm.options.length < 6) {
      setQuestionForm({ ...questionForm, options: [...questionForm.options, ''] });
    }
  }

  // Remove option field
  function removeOption(index) {
    if (questionForm.options.length > 2) {
      const newOptions = [...questionForm.options];
      newOptions.splice(index, 1);
      
      // Adjust correctIndex if needed
      let newCorrectIndex = questionForm.correctIndex;
      if (questionForm.correctIndex === index) {
        newCorrectIndex = 0;
      } else if (questionForm.correctIndex > index) {
        newCorrectIndex = questionForm.correctIndex - 1;
      }
      
      setQuestionForm({ 
        ...questionForm, 
        options: newOptions,
        correctIndex: newCorrectIndex
      });
    }
  }

  // Reset form state
  function resetForm() {
    setForm({ 
      title: '', 
      description: '', 
      timeLimit: '',
      questions: []
    });
    setFormMode('create');
    setActiveQuiz(null);
    setError(null);
    setActiveTab('basic');
  }

  // Reset question form
  function resetQuestionForm() {
    setQuestionForm({
      questionText: '',
      options: ['', ''],
      correctIndex: 0,
      difficulty: 'medium',
      tags: ''
    });
    setActiveQuestionIndex(-1);
  }

  // Open form for creating new quiz
  function openCreateForm() {
    resetForm();
    setShowForm(true);
  }

  // Open form for editing a quiz
  function openEditForm(quiz) {
    setForm({
      title: quiz.title,
      description: quiz.description,
      timeLimit: quiz.timeLimit,
      questions: quiz.questions || []
    });
    setFormMode('edit');
    setActiveQuiz(quiz);
    setShowForm(true);
  }

  // Open form for creating/editing question
  function openQuestionForm(index = -1) {
    if (index >= 0 && form.questions[index]) {
      // Edit existing question
      const question = form.questions[index];
      setQuestionForm({
        questionText: question.questionText,
        options: [...question.options],
        correctIndex: question.correctIndex,
        difficulty: question.difficulty || 'medium',
        tags: question.tags ? question.tags.join(', ') : ''
      });
      setActiveQuestionIndex(index);
    } else {
      // Create new question
      resetQuestionForm();
    }
    setShowQuestionForm(true);
  }

  // Save question to quiz form
  function saveQuestion(e) {
    e.preventDefault();
    
    // Validate question form
    if (!questionForm.questionText.trim()) {
      setError('Question text is required');
      return;
    }
    
    if (questionForm.options.some(option => !option.trim())) {
      setError('All options must have content');
      return;
    }

    const newQuestion = {
      questionText: questionForm.questionText,
      options: questionForm.options,
      correctIndex: parseInt(questionForm.correctIndex),
      difficulty: questionForm.difficulty,
      tags: questionForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    let updatedQuestions;
    if (activeQuestionIndex >= 0) {
      // Update existing question
      updatedQuestions = [...form.questions];
      updatedQuestions[activeQuestionIndex] = newQuestion;
    } else {
      // Add new question
      updatedQuestions = [...form.questions, newQuestion];
    }

    setForm({ ...form, questions: updatedQuestions });
    setShowQuestionForm(false);
    resetQuestionForm();
    setError(null);
  }

  // Remove question from quiz form
  function removeQuestion(index) {
    const updatedQuestions = [...form.questions];
    updatedQuestions.splice(index, 1);
    setForm({ ...form, questions: updatedQuestions });
  }

  // Create new quiz
  async function handleCreate(e) {
    e.preventDefault();
    setError(null);

    if (!form.title || !form.description || !form.timeLimit) {
      setError('Please fill all quiz details fields');
      return;
    }

    if (form.questions.length === 0) {
      setError('Quiz must have at least one question');
      return;
    }

    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          timeLimit: Number(form.timeLimit),
          questions: form.questions
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to create quiz');
      }

      // Clear form and refresh list
      resetForm();
      setShowForm(false);
      fetchQuizzes();
    } catch (err) {
      setError(err.message);
    }
  }

  // Update quiz
  async function handleUpdate(e) {
    e.preventDefault();
    setError(null);

    if (!form.title || !form.description || !form.timeLimit) {
      setError('Please fill all quiz details fields');
      return;
    }

    if (form.questions.length === 0) {
      setError('Quiz must have at least one question');
      return;
    }

    try {
      const res = await fetch(`/api/quiz/${activeQuiz._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          timeLimit: Number(form.timeLimit),
          questions: form.questions
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to update quiz');
      }

      resetForm();
      setShowForm(false);
      fetchQuizzes();
    } catch (err) {
      setError(err.message);
    }
  }

  // Delete quiz
  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this quiz?')) return;

    try {
      const res = await fetch(`/api/quiz/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to delete quiz');
      }
      fetchQuizzes();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading quizzes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Quiz Management</h2>
          <button 
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            onClick={openCreateForm}
          >
            <FaPlus className="mr-2" /> Add New Quiz
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-600">
            <FaInfoCircle className="mr-2" /> {error}
          </div>
        )}

        {/* Quiz Form */}
        {showForm && (
          <div className="mb-8 bg-white rounded-xl shadow-lg overflow-hidden">
            <form onSubmit={formMode === 'create' ? handleCreate : handleUpdate} className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  {formMode === 'create' ? 'Create New Quiz' : 'Edit Quiz'}
                </h3>
                <div className="flex space-x-2">
                  <button 
                    type="button"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      activeTab === 'basic' 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab('basic')}
                  >
                    Quiz Details
                  </button>
                  <button 
                    type="button"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      activeTab === 'questions' 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab('questions')}
                  >
                    Questions ({form.questions.length})
                  </button>
                </div>
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)} 
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <FaTimes />
                </button>
              </div>

              {activeTab === 'basic' && (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      placeholder="Quiz Title"
                      value={form.title}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      placeholder="Quiz Description"
                      value={form.description}
                      onChange={handleChange}
                      required
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="timeLimit" className="block text-sm font-medium text-gray-700 mb-1">Time Limit (minutes)</label>
                    <input
                      type="number"
                      id="timeLimit"
                      name="timeLimit"
                      placeholder="Time Limit"
                      value={form.timeLimit}
                      onChange={handleChange}
                      required
                      min={1}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'questions' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-lg font-medium text-gray-800">Quiz Questions</h4>
                    <button 
                      type="button" 
                      className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                      onClick={() => openQuestionForm()}
                    >
                      <FaPlus className="mr-1" /> Add Question
                    </button>
                  </div>
                  
                  {form.questions.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">No questions added yet. Add at least one question to create a quiz.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {form.questions.map((question, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <span className="font-medium text-gray-700 mr-2">Q{index + 1}:</span>
                            <span className="text-gray-600">{question.questionText}</span>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              onClick={() => openQuestionForm(index)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              <FaEdit />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeQuestion(index)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="mt-8 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  {formMode === 'create' ? 'Create Quiz' : 'Update Quiz'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Question Form Modal */}
        {showQuestionForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {activeQuestionIndex >= 0 ? 'Edit Question' : 'Add Question'}
                  </h3>
                  <button 
                    type="button" 
                    onClick={() => setShowQuestionForm(false)} 
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
              
              <form onSubmit={saveQuestion} className="p-6 space-y-6">
                <div>
                  <label htmlFor="questionText" className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                  <textarea
                    id="questionText"
                    name="questionText"
                    placeholder="Enter question text"
                    value={questionForm.questionText}
                    onChange={handleQuestionChange}
                    required
                    rows={2}
                    className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Options</label>
                    <button 
                      type="button" 
                      onClick={addOption} 
                      className="inline-flex items-center px-3 py-1.5 text-sm bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors duration-200"
                      disabled={questionForm.options.length >= 6}
                    >
                      <FaPlus className="mr-1" /> Add Option
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {questionForm.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="flex-1 flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                          <input
                            type="radio"
                            id={`correct-${index}`}
                            name="correctIndex"
                            value={index}
                            checked={parseInt(questionForm.correctIndex) === index}
                            onChange={handleQuestionChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                          />
                          <input
                            type="text"
                            placeholder={`Option ${index + 1}`}
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            required
                            className="flex-1 bg-transparent border-0 focus:ring-0 p-0 text-gray-700 placeholder-gray-400"
                          />
                        </div>
                        {questionForm.options.length > 2 && (
                          <button 
                            type="button" 
                            onClick={() => removeOption(index)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          >
                            <FaTimes />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-gray-500">Select the radio button next to the correct answer</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                    <select
                      id="difficulty"
                      name="difficulty"
                      value={questionForm.difficulty}
                      onChange={handleQuestionChange}
                      className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                    <input
                      type="text"
                      id="tags"
                      name="tags"
                      placeholder="math, algebra, etc."
                      value={questionForm.tags}
                      onChange={handleQuestionChange}
                      className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button 
                    type="button" 
                    onClick={() => setShowQuestionForm(false)} 
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                  >
                    Save Question
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Quiz List */}
        {quizzes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <p className="text-gray-500">No quizzes available. Create your first quiz!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <div key={quiz._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{quiz.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{quiz.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <FaClock className="mr-1" /> {quiz.timeLimit} min
                    </span>
                    <span className="flex items-center">
                      <FaQuestionCircle className="mr-1" /> {quiz.questions?.length || 0} questions
                    </span>
                  </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-2">
                  <button 
                    onClick={() => openEditForm(quiz)} 
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    title="Edit Quiz"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    onClick={() => handleDelete(quiz._id)} 
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    title="Delete Quiz"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
