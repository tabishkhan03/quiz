import Link from "next/link";
import { FaTrophy, FaChartLine, FaClock, FaBook, FaUsers, FaLaptopCode, FaGraduationCap } from 'react-icons/fa';

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section with animated gradient and curved shape */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 text-white">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="absolute -bottom-1 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
            <path fill="#ffffff" fillOpacity="1" d="M0,128L48,112C96,96,192,64,288,74.7C384,85,480,139,576,144C672,149,768,107,864,96C960,85,1056,107,1152,133.3C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-36 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
              <div className="inline-block rounded-lg bg-white/10 px-3 py-1 text-sm backdrop-blur-sm mb-6">
                <span className="animate-pulse mr-2 inline-block h-2 w-2 rounded-full bg-white"></span> 
                Learning made interactive
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                Challenge Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-yellow-200">Knowledge</span>, Anytime, Anywhere
        </h1>
              <p className="text-lg md:text-xl opacity-90 mb-8 leading-relaxed">
                Join thousands of learners and test yourself with exciting quizzes across topics and levels. 
                Track your progress and climb the leaderboard!
        </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <Link
          href="/register"
                  className="inline-block px-8 py-4 bg-white text-indigo-700 font-semibold rounded-full shadow-lg hover:shadow-xl hover:bg-gray-100 transition transform hover:-translate-y-0.5"
        >
                  Get Started Free
                </Link>
                <Link
                  href="/login"
                  className="inline-block px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-full hover:bg-white/20 transition transform hover:-translate-y-0.5"
                >
                  Log In
        </Link>
              </div>
              <div className="mt-10 text-white/70 text-sm">
                <p>Already trusted by 10,000+ students & professionals</p>
                <div className="flex mt-3 space-x-4">
                  <img src="https://flowbite.com/docs/images/logo.svg" alt="Company 1" className="h-8 opacity-75 grayscale hover:grayscale-0 transition" />
                  <img src="https://tailwindui.com/img/logos/tuple-logo-gray-400.svg" alt="Company 2" className="h-8 opacity-75 grayscale hover:grayscale-0 transition" />
                  <img src="https://tailwindui.com/img/logos/statickit-logo-gray-400.svg" alt="Company 3" className="h-8 opacity-75 grayscale hover:grayscale-0 transition" />
                </div>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="relative bg-white p-4 md:p-8 rounded-2xl shadow-2xl transform rotate-1 transition-all hover:rotate-0 duration-300">
                <div className="bg-gray-100 rounded-lg overflow-hidden">
                  <div className="bg-gray-200 h-5 w-full flex space-x-1 items-center px-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="text-xs text-gray-500 ml-2">QuizMaster</div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="font-bold text-gray-800">JavaScript Fundamentals</h3>
                        <p className="text-xs text-gray-500">10 Questions • 10 Minutes</p>
                      </div>
                      <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Intermediate</span>
                    </div>
                    <div className="mb-4 bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                      <p className="text-sm text-gray-700 mb-3">What is the output of the following code?</p>
                      <pre className="bg-gray-50 text-gray-800 rounded p-2 text-xs font-mono overflow-x-auto">console.log(typeof null);</pre>
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center">
                          <input type="radio" id="opt1" name="question1" className="mr-2 accent-indigo-600" />
                          <label htmlFor="opt1" className="text-sm">null</label>
                        </div>
                        <div className="flex items-center">
                          <input type="radio" id="opt2" name="question1" className="mr-2 accent-indigo-600" checked />
                          <label htmlFor="opt2" className="text-sm font-medium">object</label>
                        </div>
                        <div className="flex items-center">
                          <input type="radio" id="opt3" name="question1" className="mr-2 accent-indigo-600" />
                          <label htmlFor="opt3" className="text-sm">undefined</label>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <button className="px-4 py-1.5 text-sm bg-gray-200 text-gray-700 rounded-md">Previous</button>
                      <div className="text-sm font-medium text-gray-600">2/10</div>
                      <button className="px-4 py-1.5 text-sm bg-indigo-600 text-white rounded-md">Next</button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative elements around the quiz preview */}
              <div className="hidden md:block absolute -top-4 -right-4 bg-yellow-400 h-10 w-10 rounded-full"></div>
              <div className="hidden md:block absolute -bottom-4 -left-4 bg-indigo-400 h-14 w-14 rounded-full"></div>
              <div className="hidden md:block absolute top-1/4 -left-8 bg-green-400 h-6 w-6 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with animated cards */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Features</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6 text-gray-900">
              Why Choose <span className="text-indigo-600">QuizMaster</span>?
        </h2>
            <p className="max-w-2xl mx-auto text-gray-600 text-lg">
              Our platform offers everything you need to learn effectively, test your knowledge, and track your progress.
            </p>
          </div>
        <div className="grid gap-10 md:grid-cols-3">
          <FeatureCard
            title="Wide Range of Topics"
              description="Explore quizzes on technology, science, history, and much more to expand your knowledge across disciplines."
              icon={<FaBook className="w-10 h-10 text-indigo-600" />}
              accentColor="bg-indigo-100"
          />
          <FeatureCard
            title="Real-time Leaderboard"
              description="Compete with others and see your rank improve with every quiz you complete. Challenge yourself to reach the top!"
              icon={<FaTrophy className="w-10 h-10 text-amber-600" />}
              accentColor="bg-amber-100"
          />
          <FeatureCard
            title="Track Your Progress"
              description="View detailed analytics on your performance over time and identify areas for improvement."
              icon={<FaChartLine className="w-10 h-10 text-emerald-600" />}
              accentColor="bg-emerald-100"
            />
            <FeatureCard
              title="Timed Challenges"
              description="Test your knowledge under pressure with timed quizzes that simulate real exam conditions."
              icon={<FaClock className="w-10 h-10 text-rose-600" />}
              accentColor="bg-rose-100"
            />
            <FeatureCard
              title="Learn From Experts"
              description="Our quizzes are created by industry professionals and educators to ensure quality content."
              icon={<FaGraduationCap className="w-10 h-10 text-blue-600" />}
              accentColor="bg-blue-100"
            />
            <FeatureCard
              title="Mobile Friendly"
              description="Access quizzes on any device, anytime, anywhere. Perfect for learning on the go."
              icon={<FaLaptopCode className="w-10 h-10 text-purple-600" />}
              accentColor="bg-purple-100"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-br from-indigo-50 to-indigo-100 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Our Impact</span>
            <h2 className="text-3xl font-bold mt-4 text-gray-900">By the Numbers</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6 bg-white rounded-xl shadow-sm">
              <div className="text-4xl font-bold text-indigo-600">500+</div>
              <div className="text-gray-600 mt-2">Quizzes Available</div>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm">
              <div className="text-4xl font-bold text-indigo-600">10K+</div>
              <div className="text-gray-600 mt-2">Active Users</div>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm">
              <div className="text-4xl font-bold text-indigo-600">50K+</div>
              <div className="text-gray-600 mt-2">Quizzes Completed</div>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm">
              <div className="text-4xl font-bold text-indigo-600">98%</div>
              <div className="text-gray-600 mt-2">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section with card design */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6 text-gray-900">What Our Users Say</h2>
            <p className="max-w-2xl mx-auto text-gray-600 text-lg">
              Join thousands of satisfied users who have transformed the way they learn with QuizMaster.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
          <Testimonial
            name="Alice Johnson"
              role="Computer Science Student"
            avatar="https://randomuser.me/api/portraits/women/68.jpg"
              quote="QuizMaster helped me prepare for my exams in a fun and interactive way. The immediate feedback on my answers helped me identify and fix my knowledge gaps."
          />
          <Testimonial
            name="Mark Robinson"
              role="Full-Stack Developer"
            avatar="https://randomuser.me/api/portraits/men/45.jpg"
              quote="The technical quizzes on this platform keep me sharp. The leaderboard adds a competitive element that motivates me to keep improving my skills."
          />
          <Testimonial
            name="Sara Lee"
              role="High School Teacher"
            avatar="https://randomuser.me/api/portraits/women/55.jpg"
              quote="I create custom quizzes for my students, and they love the gamified approach to learning. It's made a huge difference in engagement and retention."
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">FAQs</span>
            <h2 className="text-3xl font-bold mt-4 mb-6 text-gray-900">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-6">
            <FaqItem 
              question="Is QuizMaster free to use?" 
              answer="Yes, QuizMaster is completely free for basic use. We offer premium features for educators and organizations that need advanced quiz creation and analytics." 
            />
            <FaqItem 
              question="How are the leaderboards calculated?" 
              answer="Leaderboards are calculated based on your total score across all quizzes. We also factor in completion time as a tiebreaker." 
            />
            <FaqItem 
              question="Can I create my own quizzes?" 
              answer="Yes! Registered users can create and share custom quizzes with their friends or students. Admin users have additional capabilities for quiz management." 
            />
            <FaqItem 
              question="Is there a mobile app available?" 
              answer="While we don't have a dedicated app yet, our website is fully responsive and works beautifully on mobile devices." 
          />
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 text-white py-20 px-6">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to start your learning journey?
        </h2>
          <p className="max-w-2xl mx-auto text-lg mb-10 text-indigo-100">
            Join thousands of learners on QuizMaster today and take your first step toward mastering new skills.
          </p>
        <Link
          href="/register"
            className="inline-block px-8 py-4 bg-white text-indigo-700 font-semibold rounded-full shadow-lg hover:shadow-xl hover:bg-gray-100 transition transform hover:-translate-y-0.5"
        >
            Get Started Now — It's Free
        </Link>
          <p className="mt-4 text-sm text-indigo-200">No credit card required</p>
        </div>
        {/* Decorative elements */}
        <div className="absolute -top-16 -right-16 bg-white/10 h-32 w-32 rounded-full backdrop-blur-md"></div>
        <div className="absolute -bottom-20 -left-20 bg-white/10 h-40 w-40 rounded-full backdrop-blur-md"></div>
      </section>
    </main>
  );
}

function FeatureCard({ title, description, icon, accentColor }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className={`${accentColor} rounded-full w-16 h-16 flex items-center justify-center mb-6`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function Testimonial({ name, role, avatar, quote }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center mb-6">
        <div className="relative">
      <img
        src={avatar}
        alt={name}
            className="w-16 h-16 rounded-full object-cover ring-4 ring-indigo-50"
      />
          <div className="absolute -bottom-1 -right-1 bg-indigo-500 text-white rounded-full p-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10c0 4.42-3.58 8-8 8-4.42 0-8-3.58-8-8 0-4.42 3.58-8 8-8 4.42 0 8 3.58 8 8zM7 9a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              <path d="M9 14h2v-4H9v4z" />
            </svg>
          </div>
        </div>
        <div className="ml-4">
      <h4 className="font-semibold text-gray-900">{name}</h4>
      <span className="text-sm text-gray-500">{role}</span>
        </div>
      </div>
      <svg className="h-8 w-8 text-gray-200 mb-4" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
        <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
      </svg>
      <p className="text-gray-600 mb-4">"{quote}"</p>
      <div className="flex text-amber-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </div>
    </div>
  );
}

function FaqItem({ question, answer }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
      <details className="group">
        <summary className="flex items-center justify-between p-6 cursor-pointer">
          <h3 className="font-medium text-gray-900">{question}</h3>
          <div className="ml-4">
            <svg 
              className="w-5 h-5 text-indigo-500 group-open:rotate-180 transition" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </summary>
        <div className="px-6 pb-6 pt-0 text-gray-600">
          <p>{answer}</p>
        </div>
      </details>
    </div>
  );
}
