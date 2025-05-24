'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const menuRef = useRef(null);

  async function fetchUser() {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.loggedIn ? data.user : null);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }

  useEffect(() => {
    fetchUser();

    // Handle scrolling effects
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);

    // Listen for login/logout events
    function onLogin() {
      fetchUser();
    }
    function onLogout() {
      setUser(null);
    }

    window.addEventListener('userLoggedIn', onLogin);
    window.addEventListener('userLoggedOut', onLogout);

    // Handle clicks outside the mobile menu to close it
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target) && isOpen) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('userLoggedIn', onLogin);
      window.removeEventListener('userLoggedOut', onLogout);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setIsOpen(false);
      router.push('/login');
      // Notify others Navbar updated
      window.dispatchEvent(new Event('userLoggedOut'));
    } catch (error) {
      console.error('Logout failed', error);
    }
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className={`font-bold text-xl flex items-center transition-colors duration-300 ${
              scrolled ? 'text-indigo-600' : 'text-indigo-800'
            }`}>
              <svg 
                className="w-8 h-8 mr-2" 
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
              <span className="hidden sm:inline">QuizMaster</span>
              <span className="sm:hidden">QM</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link 
              href="/" 
              className={`text-sm font-medium transition-colors duration-300 hover:text-indigo-800 ${
                scrolled ? 'text-gray-700' : 'text-indigo-600'
              }`}
            >
              Home
            </Link>

            {user ? (
              <>
                <Link 
                  href="/dashboard" 
                  className={`text-sm font-medium transition-colors duration-300 hover:text-indigo-400 ${
                    scrolled ? 'text-gray-700' : 'text-indigo-600'
                  }`}
                >
                  Dashboard
                </Link>
                
                <button
                  onClick={handleLogout}
                  className={`text-sm font-medium bg-transparent border-none cursor-pointer transition-colors duration-300 hover:text-indigo-400 ${
                    scrolled ? 'text-gray-700' : 'text-indigo-600'
                  }`}
                >
                  Logout
                </button>
                
                <div className="ml-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    scrolled ? 'bg-indigo-100 text-indigo-600' : 'bg-indigo-600 text-white'
                  }`}>
                    {user.username?.charAt(0).toUpperCase() || user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className={`text-sm font-medium transition-colors duration-300 hover:text-indigo-400 ${
                    scrolled ? 'text-gray-700' : 'text-indigo-600'
                  }`}
                >
                  Login
                </Link>
                
                <Link 
                  href="/signup" 
                  className={`text-sm font-medium px-4 py-2 rounded-md transition-all duration-300 ${
                    scrolled 
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                      : 'bg-white text-indigo-600 hover:bg-gray-100'
                  }`}
                >
                  Register
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className={`inline-flex items-center justify-center p-2 rounded-md transition-colors duration-300 ${
                scrolled 
                  ? 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50' 
                  : 'text-white hover:text-white hover:bg-indigo-600/25'
              }`}
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div 
          ref={menuRef}
          className="md:hidden bg-white shadow-lg rounded-b-lg mt-2 mx-4 overflow-hidden transition-all duration-300 transform origin-top"
        >
          <div className="px-4 pt-4 pb-6 space-y-4">
            <Link 
              href="/" 
              className="block px-4 py-3 text-gray-700 rounded-md hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-300" 
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>

            {user ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="block px-4 py-3 text-gray-700 rounded-md hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-300" 
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                
                <div className="px-4 pt-2 pb-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-indigo-100 text-indigo-600 font-medium rounded-full flex items-center justify-center">
                      {user.username?.charAt(0).toUpperCase() || user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.username || user.name}</p>
                      <p className="text-xs text-gray-500">{user.role}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 mt-2 text-gray-700 bg-gray-50 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors duration-300"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="block px-4 py-3 text-gray-700 rounded-md hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-300" 
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                
                <Link 
                  href="/signup" 
                  className="block px-4 py-3 text-center font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-300" 
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Overlay for when menu is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 md:hidden"
          aria-hidden="true"
          onClick={() => setIsOpen(false)}
        />
      )}
    </nav>
  );
}
