import { useState } from 'react'

function TodoItem({ todo, toggleTodo, setSelectedTodo, isSelected, updateTodo }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(todo.title)

  const handleSave = () => {
    if (editedTitle.trim()) {
      updateTodo(todo.id, { title: editedTitle.trim() })
      setIsEditing(false)
    }
  }

  const handleDoubleClick = (e) => {
    e.stopPropagation()
    setIsEditing(true)
  }

  return (
    <div
      onClick={() => setSelectedTodo(todo)}
      className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
        isSelected
          ? 'border-ms-blue bg-ms-blue-light dark:bg-ms-blue dark:bg-opacity-20'
          : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
      }`}
    >
      <button
        onClick={(e) => {
          e.stopPropagation()
          toggleTodo(todo.id)
        }}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
          todo.completed
            ? 'bg-ms-blue border-ms-blue'
            : 'border-gray-400 hover:border-ms-blue'
        }`}
      >
        {todo.completed && (
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </button>
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave()
              if (e.key === 'Escape') {
                setEditedTitle(todo.title)
                setIsEditing(false)
              }
            }}
            onClick={(e) => e.stopPropagation()}
            autoFocus
            className="w-full px-2 py-1 border border-ms-blue rounded focus:outline-none focus:ring-2 focus:ring-ms-blue"
          />
        ) : (
          <p
            onDoubleClick={handleDoubleClick}
            className={`text-gray-800 dark:text-gray-200 ${
              todo.completed ? 'line-through text-gray-400 dark:text-gray-500' : ''
            }`}
          >
            {todo.title}
          </p>
        )}
        {todo.subtasks.length > 0 && (
          <p className="text-sm text-gray-500 mt-1">
            {todo.subtasks.filter((st) => st.completed).length} / {todo.subtasks.length} 완료
          </p>
        )}
        {todo.dueDate && (
          <p className="text-sm text-gray-500 mt-1">
            마감일: {new Date(todo.dueDate).toLocaleDateString('ko-KR')}
          </p>
        )}
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {/* 카테고리 배지 */}
          {todo.category && (
            <span className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
              {todo.category}
            </span>
          )}
          {/* 우선순위 배지 */}
          {todo.priority && todo.priority !== 'medium' && (
            <span className={`px-2 py-0.5 text-xs rounded ${
              todo.priority === 'high' 
                ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
            }`}>
              {todo.priority === 'high' ? '높음' : '낮음'}
            </span>
          )}
          {/* 반복 배지 */}
          {todo.recurring && (
            <span className="px-2 py-0.5 text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {todo.recurring === 'daily' ? '매일' : todo.recurring === 'weekly' ? '매주' : '매월'}
            </span>
          )}
          {/* 태그 */}
          {todo.tags?.map((tag, index) => (
            <span key={index} className="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TodoItem
