import { useState } from 'react'

function DetailPanel({
  todo,
  updateTodo,
  deleteTodo,
  addSubtask,
  toggleSubtask,
  deleteSubtask,
  onClose,
  isMobile = false,
}) {
  const [subtaskInput, setSubtaskInput] = useState('')
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedTitle, setEditedTitle] = useState(todo.title)

  const handleAddSubtask = (e) => {
    e.preventDefault()
    if (subtaskInput.trim()) {
      addSubtask(todo.id, subtaskInput.trim())
      setSubtaskInput('')
    }
  }

  const handleSaveTitle = () => {
    if (editedTitle.trim()) {
      updateTodo(todo.id, { title: editedTitle.trim() })
      setIsEditingTitle(false)
    }
  }

  const handleToggleMyDay = () => {
    updateTodo(todo.id, { isMyDay: !todo.isMyDay })
  }

  const completeAllSubtasks = () => {
    const updatedSubtasks = todo.subtasks.map(st => ({ ...st, completed: true }))
    updateTodo(todo.id, { subtasks: updatedSubtasks })
  }

  const deleteAllSubtasks = () => {
    if (window.confirm('모든 세부 단계를 삭제하시겠습니까?')) {
      updateTodo(todo.id, { subtasks: [] })
    }
  }

  return (
    <div className={`${isMobile ? 'w-full h-full' : 'w-96'} bg-white dark:bg-gray-800 ${!isMobile && 'border-l border-gray-200 dark:border-gray-600'} flex flex-col transition-colors`}>
      {/* 모바일용 드래그 핸들 */}
      {isMobile && (
        <div className="flex justify-center py-2">
          <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        </div>
      )}
      <div className="p-4 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">세부 정보</h3>
        <button
          onClick={onClose}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Title Section */}
        <div>
          {isEditingTitle ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onBlur={handleSaveTitle}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveTitle()
                  if (e.key === 'Escape') {
                    setEditedTitle(todo.title)
                    setIsEditingTitle(false)
                  }
                }}
                autoFocus
                className="w-full px-3 py-2 border border-ms-blue dark:border-ms-blue dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-ms-blue"
              />
            </div>
          ) : (
            <div
              onClick={() => setIsEditingTitle(true)}
              className="cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <p className="text-gray-800 dark:text-white font-medium">{todo.title}</p>
            </div>
          )}
        </div>

        {/* My Day Toggle */}
        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <span className="text-gray-700 dark:text-gray-300">나의 하루에 추가</span>
          </div>
          <button
            onClick={handleToggleMyDay}
            className={`w-12 h-6 rounded-full transition-colors ${
              todo.isMyDay ? 'bg-ms-blue' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                todo.isMyDay ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* 카테고리 */}
        <div className="space-y-2">
          <label className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            카테고리
          </label>
          <select
            value={todo.category || '기타'}
            onChange={(e) => updateTodo(todo.id, { category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-ms-blue"
          >
            <option value="개인">개인</option>
            <option value="업무">업무</option>
            <option value="쇼핑">쇼핑</option>
            <option value="기타">기타</option>
          </select>
        </div>

        {/* 우선순위 */}
        <div className="space-y-2">
          <label className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            우선순위
          </label>
          <select
            value={todo.priority || 'medium'}
            onChange={(e) => updateTodo(todo.id, { priority: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-ms-blue"
          >
            <option value="low">낮음</option>
            <option value="medium">보통</option>
            <option value="high">높음</option>
          </select>
        </div>

        {/* 반복 */}
        <div className="space-y-2">
          <label className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            반복
          </label>
          <select
            value={todo.recurring || ''}
            onChange={(e) => updateTodo(todo.id, { recurring: e.target.value || null })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-ms-blue"
          >
            <option value="">반복 안 함</option>
            <option value="daily">매일</option>
            <option value="weekly">매주</option>
            <option value="monthly">매월</option>
          </select>
        </div>

        {/* Due Date Section */}
        <div className="space-y-2">
          <label className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            마감일
          </label>
          <input
            type="date"
            value={todo.dueDate || ''}
            onChange={(e) => updateTodo(todo.id, { dueDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-ms-blue"
          />
        </div>

        {/* 태그 */}
        <div className="space-y-2">
          <label className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
            태그
          </label>
          <div className="flex flex-wrap gap-2">
            {todo.tags?.map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-sm flex items-center gap-1">
                #{tag}
                <button
                  onClick={() => {
                    const newTags = todo.tags.filter((_, i) => i !== index)
                    updateTodo(todo.id, { tags: newTags })
                  }}
                  className="hover:text-red-600"
                >
                  ×
                </button>
              </span>
            ))}
            <button
              onClick={() => {
                const tag = prompt('태그 입력:')
                if (tag && tag.trim()) {
                  updateTodo(todo.id, { tags: [...(todo.tags || []), tag.trim()] })
                }
              }}
              className="px-2 py-1 border border-dashed border-gray-400 dark:border-gray-600 rounded text-sm text-gray-600 dark:text-gray-400 hover:border-ms-blue hover:text-ms-blue"
            >
              + 태그 추가
            </button>
          </div>
        </div>

        {/* Subtasks Section */}
        <div className="space-y-3">
          <label className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
            세부 단계
          </label>
          <form onSubmit={handleAddSubtask} className="flex gap-2">
            <input
              type="text"
              value={subtaskInput}
              onChange={(e) => setSubtaskInput(e.target.value)}
              placeholder="세부 단계 추가"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-ms-blue text-sm"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-ms-blue text-white rounded-lg hover:bg-ms-blue-hover transition-colors text-sm font-medium"
            >
              추가
            </button>
          </form>
          <div className="space-y-2">
            {todo.subtasks.map((subtask) => (
              <div
                key={subtask.id}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 group"
              >
                <button
                  onClick={() => toggleSubtask(todo.id, subtask.id)}
                  className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    subtask.completed
                      ? 'bg-ms-blue border-ms-blue'
                      : 'border-gray-400 hover:border-ms-blue'
                  }`}
                >
                  {subtask.completed && (
                    <svg
                      className="w-3 h-3 text-white"
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
                <span
                  className={`flex-1 text-sm ${
                    subtask.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {subtask.title}
                </span>
                <button
                  onClick={() => deleteSubtask(todo.id, subtask.id)}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          {todo.subtasks.length > 0 && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={completeAllSubtasks}
                className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
              >
                전체 완료
              </button>
              <button
                onClick={deleteAllSubtasks}
                className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
              >
                전체 삭제
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Button */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => {
            if (window.confirm('이 할 일을 삭제하시겠습니까?')) {
              deleteTodo(todo.id)
            }
          }}
          className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          할 일 삭제
        </button>
      </div>
    </div>
  )
}

export default DetailPanel
