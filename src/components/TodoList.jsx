import { useState } from 'react'
import TodoItem from './TodoItem'

/**
 * TodoList 컴포넌트
 * 할 일 목록을 표시하고 관리하는 메인 컴포넌트
 * @param {Array} todos - 할 일 목록 배열
 * @param {Function} addTodo - 할 일 추가 함수
 * @param {Function} toggleTodo - 할 일 완료/미완료 토글 함수
 * @param {Function} setSelectedTodo - 선택된 할 일 설정 함수
 * @param {Object} selectedTodo - 현재 선택된 할 일
 * @param {String} currentView - 현재 보기 모드 ('all' 또는 'myday')
 * @param {Function} updateTodo - 할 일 업데이트 함수
 * @param {Function} completeAllTodos - 모든 할 일 완료 함수
 * @param {Function} deleteAllTodos - 모든 할 일 삭제 함수
 * @param {Boolean} darkMode - 다크 모드 상태
 * @param {Function} setDarkMode - 다크 모드 설정 함수
 * @param {Function} setCurrentView - 보기 모드 설정 함수
 */
function TodoList({ 
  todos, 
  addTodo, 
  toggleTodo, 
  setSelectedTodo, 
  selectedTodo, 
  currentView, 
  updateTodo, 
  completeAllTodos, 
  deleteAllTodos,
  darkMode,
  setDarkMode,
  setCurrentView
}) {
  // 할 일 입력 필드의 값을 관리하는 상태
  const [inputValue, setInputValue] = useState('')

  // 폼 제출 시 새로운 할 일 추가
  const handleSubmit = (e) => {
    e.preventDefault() // 페이지 새로고침 방지
    if (inputValue.trim()) { // 빈 문자열이 아닐 때만 추가
      addTodo(inputValue.trim())
      setInputValue('') // 입력 필드 초기화
    }
  }

  // 현재 보기 모드에 따라 제목 반환
  const getTitle = () => {
    return currentView === 'myday' ? '나의 하루' : '전체 할 일'
  }

  return (
    // 메인 컨테이너: 세로 방향 flex, 전체 높이 사용
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 transition-colors">
      {/* 헤더 영역: 제목과 입력 폼 */}
      <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-600">
        {/* 모바일용 상단 바: 메뉴 버튼과 다크모드 토글 */}
        <div className="md:hidden flex items-center justify-between mb-4">
          <select
            value={currentView}
            onChange={(e) => setCurrentView(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-sm"
          >
            <option value="all">전체 할 일</option>
            <option value="myday">나의 하루</option>
          </select>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
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
        
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4">{getTitle()}</h2>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="할 일 추가"
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-ms-blue focus:border-transparent"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-ms-blue text-white rounded-lg hover:bg-ms-blue-hover transition-colors font-medium"
          >
            추가
          </button>
        </form>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        {todos.length === 0 ? (
          <div className="text-center text-gray-400 mt-12">
            <svg
              className="w-16 h-16 mx-auto mb-4 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-lg">할 일이 없습니다</p>
          </div>
        ) : (
          <div className="space-y-2">
            {todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                toggleTodo={toggleTodo}
                setSelectedTodo={setSelectedTodo}
                isSelected={selectedTodo?.id === todo.id}
                updateTodo={updateTodo}
              />
            ))}
          </div>
        )}
      </div>
      {todos.length > 0 && (
        <div className="p-4 border-t border-gray-200 flex gap-3">
          <button
            onClick={completeAllTodos}
            className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            전체 완료
          </button>
          <button
            onClick={deleteAllTodos}
            className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            전체 삭제
          </button>
        </div>
      )}
    </div>
  )
}

export default TodoList
