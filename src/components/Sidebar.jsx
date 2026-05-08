function Sidebar({ currentView, setCurrentView, darkMode, setDarkMode }) {
  return (
    <div className="w-64 bg-gray-50 dark:bg-gray-700 border-r border-gray-200 dark:border-gray-600 p-4 transition-colors">
      <div className="flex items-center justify-between mb-6 px-2">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">To Do</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          title={darkMode ? '라이트 모드' : '다크 모드'}
        >
          {darkMode ? (
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>
      </div>
      <nav>
        <button
          onClick={() => setCurrentView('myday')}
          className={`w-full text-left px-4 py-3 rounded-lg mb-2 flex items-center transition-colors ${
            currentView === 'myday'
              ? 'bg-ms-blue-light dark:bg-ms-blue dark:bg-opacity-20 text-ms-blue font-medium'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <svg
            className="w-5 h-5 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          나의 하루
        </button>
        <button
          onClick={() => setCurrentView('all')}
          className={`w-full text-left px-4 py-3 rounded-lg flex items-center transition-colors ${
            currentView === 'all'
              ? 'bg-ms-blue-light dark:bg-ms-blue dark:bg-opacity-20 text-ms-blue font-medium'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <svg
            className="w-5 h-5 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          전체 할 일
        </button>
      </nav>
    </div>
  )
}

export default Sidebar
