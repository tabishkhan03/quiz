'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaChartBar, FaTrophy, FaClipboardList, FaListAlt, FaUser, 
  FaUserShield, FaSignOutAlt, FaChevronRight, FaBars, FaSearch,
  FaBell, FaEllipsisH, FaTimes, FaAngleLeft, FaCalendarAlt
} from 'react-icons/fa';
import Leaderboard from '@/components/Leaderboard';
import QuizAttempts from '@/components/QuizAttempts';
import Quizzes from '@/components/Quizzes';
import UserProfile from '@/components/UserProfile';
import AdminQuizManager from '@/components/AdminQuizManager';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('quizzes');
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  // The navbar height for proper positioning
  const navbarHeight = '64px';

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.loggedIn) {
          setUser(data.user);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoadingUser(false);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    // Handle responsive sidebar
    function handleResize() {
      if (window.innerWidth <= 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    }
    
    // Set initial state
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  // Menu items with icons and labels
  const menuItems = [
    { key: 'quizzes', label: 'Available Quizzes', icon: <FaListAlt className="w-5 h-5" /> },
    { key: 'attempts', label: 'My Attempts', icon: <FaClipboardList className="w-5 h-5" /> },
    { key: 'leaderboard', label: 'Leaderboard', icon: <FaTrophy className="w-5 h-5" /> },
    { key: 'profile', label: 'My Profile', icon: <FaUser className="w-5 h-5" /> },
  ];

  if (user?.role === 'admin') {
    menuItems.push({ key: 'admin', label: 'Admin Panel', icon: <FaUserShield className="w-5 h-5" /> });
  }

  // Fake notifications for the UI
  const notifications = [
    {
      id: 1,
      title: 'New Quiz Available',
      message: 'JavaScript Basics quiz is now available',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      title: 'Quiz Result',
      message: 'You scored 85% on React Fundamentals',
      time: '1 day ago',
      read: true
    },
    {
      id: 3,
      title: 'Achievement Unlocked',
      message: 'You earned the "Quiz Master" badge',
      time: '2 days ago',
      read: true
    }
  ];

  if (loadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500 mb-4">
            <FaUserShield className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-6">You must be logged in to access the dashboard.</p>
          <button 
            onClick={() => router.push('/login')} 
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow transition-colors duration-200"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  // Get current tab component
  const getTabContent = () => {
    switch (activeTab) {
      case 'quizzes': return <Quizzes />;
      case 'attempts': return <QuizAttempts />;
      case 'leaderboard': return <Leaderboard />;
      case 'profile': return <UserProfile />;
      case 'admin': return <AdminQuizManager />;
      default: return <Quizzes />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-[64px]">
      {/* Sidebar backdrop for mobile */}
      {sidebarOpen && window.innerWidth <= 1024 && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden pt-[64px]" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar - adjusted to account for navbar */}
      <aside 
        className={`fixed top-[64px] left-0 z-20 h-[calc(100vh-64px)] bg-white shadow-lg transition-all duration-300 ease-in-out transform 
          ${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64 lg:translate-x-0 lg:w-20'} 
          flex flex-col overflow-y-auto`}
      >
        {/* Sidebar header with logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className={`bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-2 rounded-lg ${!sidebarOpen && 'mx-auto'}`}>
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            {sidebarOpen && <span className="ml-2 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">QuizMaster</span>}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 lg:hidden"
          >
            <FaTimes className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        {/* User info */}
        <div className={`px-4 py-3 border-b border-gray-200 ${!sidebarOpen ? 'text-center' : ''}`}>
          <div className={`flex ${!sidebarOpen ? 'flex-col items-center' : 'items-center'}`}>
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center font-medium">
              {user.username?.charAt(0).toUpperCase() || user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            {sidebarOpen && (
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-gray-800 truncate">{user.username || user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            )}
          </div>
          {!sidebarOpen && <div className="mt-2 text-xs text-gray-500 truncate">{user.role}</div>}
        </div>
        
        {/* Navigation */}
        <nav className="px-2 py-4 flex-grow">
          <div className={`text-xs font-semibold text-gray-400 uppercase tracking-wider ${!sidebarOpen ? 'text-center' : 'px-2'} mb-2`}>
            {sidebarOpen ? 'Menu' : 'Menu'}
          </div>
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setActiveTab(item.key);
                if (window.innerWidth <= 1024) {
                  setSidebarOpen(false);
                }
              }}
              className={`w-full flex items-center px-2 py-2.5 mb-1 text-sm font-medium rounded-lg transition-all duration-200 
                ${activeTab === item.key 
                  ? 'text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md' 
                  : 'text-gray-700 hover:bg-gray-100'} 
                ${!sidebarOpen ? 'justify-center' : ''}`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="ml-3 truncate">{item.label}</span>}
              {sidebarOpen && activeTab === item.key && (
                <span className="ml-auto">
                  <FaChevronRight className="w-3 h-3" />
                </span>
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content - adjusted for navbar and sidebar */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Top Navigation - adjusted z-index and position */}
        <header className="bg-white shadow-sm h-16 flex items-center px-6 sticky top-[64px] z-10">
          <div className="flex items-center lg:hidden mr-6">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <FaBars className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Page title */}
          <h1 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent truncate">
            {menuItems.find(item => item.key === activeTab)?.label || 'Dashboard'}
          </h1>
          
          <div className="ml-auto flex items-center space-x-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaSearch className="w-4 h-4 text-gray-400" />
              </div>
              <input 
                type="text" 
                placeholder="Search..." 
                className="py-1.5 pl-10 pr-4 w-40 lg:w-64 rounded-md bg-gray-100 border-transparent focus:bg-white focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 relative"
              >
                <FaBell className="w-5 h-5 text-gray-500" />
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              
              {notificationsOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-800">Notifications</h3>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map(notification => (
                          <div key={notification.id} className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 ${!notification.read ? 'bg-indigo-50' : ''}`}>
                            <div className="flex justify-between items-start">
                              <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                              <span className="text-xs text-gray-500">{notification.time}</span>
                            </div>
                            <p className="text-xs text-gray-600 mt-0.5">{notification.message}</p>
                          </div>
                        ))
                      ) : (
                        <p className="px-4 py-3 text-sm text-gray-500">No notifications</p>
                      )}
                    </div>
                    <div className="px-4 py-2 border-t border-gray-200">
                      <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                        Mark all as read
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* More Options */}
            <button className="hidden sm:block p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <FaEllipsisH className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6">
          <div className="mb-6">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <a href="#" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
                    Dashboard
                  </a>
                </li>
                <li>
                  <div className="flex items-center">
                    <FaChevronRight className="w-3 h-3 text-gray-400 mx-1" />
                    <span className="text-sm font-medium text-gray-700">
                      {menuItems.find(item => item.key === activeTab)?.label || 'Dashboard'}
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>

          {/* Dynamic content based on active tab */}
          <div className="bg-white shadow-sm rounded-lg">
            {getTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
