import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import TodoList from './components/TodoList'
import DetailPanel from './components/DetailPanel'

function App() {
  // 할 일 목록 상태 - LocalStorage에서 불러오기
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos')
    return saved ? JSON.parse(saved) : []
  })
  
  // 현재 선택된 할 일
  const [selectedTodo, setSelectedTodo] = useState(null)
  
  // 현재 보기 모드 ('all': 전체 할 일, 'myday': 나의 하루)
  const [currentView, setCurrentView] = useState('all')
  
  // 검색어 상태
  const [searchQuery, setSearchQuery] = useState('')
  
  // 정렬 옵션 ('name', 'dueDate', 'createdDate', 'priority')
  const [sortBy, setSortBy] = useState('createdDate')
  
  // 카테고리 목록
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('categories')
    return saved ? JSON.parse(saved) : ['개인', '업무', '쇼핑', '기타']
  })
  
  // 선택된 카테고리 필터
  const [selectedCategory, setSelectedCategory] = useState(null)
  
  // 다크 모드 상태 - LocalStorage에서 불러오기
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })

  // 다크 모드 변경 시 LocalStorage에 저장하고 HTML 클래스 적용
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // 할 일 목록 변경 시 LocalStorage에 저장
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = (title) => {
    const newTodo = {
      id: Date.now(),
      createdAt: new Date().toISOString(), // 생성일
      title,
      completed: false,
      dueDate: null,
      subtasks: [],
      isMyDay: currentView === 'myday', // 나의 하루에서 추가하면 자동으로 isMyDay true
      category: selectedCategory || '기타', // 카테고리
      tags: [], // 태그 목록
      priority: 'medium', // 우선순위: low, medium, high
      recurring: null, // 반복 설정: null, 'daily', 'weekly', 'monthly'
    }
    setTodos([...todos, newTodo])
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const updateTodo = (id, updates) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, ...updates } : todo
    ))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
    if (selectedTodo?.id === id) {
      setSelectedTodo(null)
    }
  }

  const addSubtask = (todoId, subtaskTitle) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === todoId) {
        const newSubtask = {
          id: Date.now(),
          title: subtaskTitle,
          completed: false,
        }
        return { ...todo, subtasks: [...todo.subtasks, newSubtask] }
      }
      return todo
    })
    setTodos(updatedTodos)
    
    // Update selectedTodo if it's the one being modified
    if (selectedTodo && selectedTodo.id === todoId) {
      const updatedTodo = updatedTodos.find(t => t.id === todoId)
      setSelectedTodo(updatedTodo)
    }
  }

  // 세부 단계 체크/해제 함수
  const toggleSubtask = (todoId, subtaskId) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === todoId) {
        // 세부 단계 상태 변경
        const updatedSubtasks = todo.subtasks.map(subtask =>
          subtask.id === subtaskId
            ? { ...subtask, completed: !subtask.completed }
            : subtask
        )
        
        // 모든 세부 단계가 완료되었는지 확인
        const allSubtasksCompleted = updatedSubtasks.length > 0 && 
          updatedSubtasks.every(subtask => subtask.completed)
        
        return {
          ...todo,
          subtasks: updatedSubtasks,
          // 모든 세부 단계가 완료되면 할 일도 자동 완료
          completed: allSubtasksCompleted ? true : todo.completed
        }
      }
      return todo
    })
    setTodos(updatedTodos)
    
    // 현재 선택된 할 일이 수정된 할 일과 같으면 상태 업데이트
    if (selectedTodo && selectedTodo.id === todoId) {
      const updatedTodo = updatedTodos.find(t => t.id === todoId)
      setSelectedTodo(updatedTodo)
    }
  }

  const deleteSubtask = (todoId, subtaskId) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === todoId) {
        return {
          ...todo,
          subtasks: todo.subtasks.filter(subtask => subtask.id !== subtaskId),
        }
      }
      return todo
    })
    setTodos(updatedTodos)
    
    // Update selectedTodo if it's the one being modified
    if (selectedTodo && selectedTodo.id === todoId) {
      const updatedTodo = updatedTodos.find(t => t.id === todoId)
      setSelectedTodo(updatedTodo)
    }
  }

  // 할 일 필터링, 검색, 정렬 함수
  const getFilteredTodos = () => {
    let filtered = todos

    // 뷰 모드에 따른 필터링
    if (currentView === 'myday') {
      const today = new Date().toDateString()
      filtered = filtered.filter(todo => {
        if (todo.isMyDay) return true
        if (todo.dueDate) {
          const dueDate = new Date(todo.dueDate).toDateString()
          return dueDate === today
        }
        return false
      })
    }

    // 카테고리 필터링
    if (selectedCategory) {
      filtered = filtered.filter(todo => todo.category === selectedCategory)
    }

    // 검색어 필터링
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(todo => 
        todo.title.toLowerCase().includes(query) ||
        todo.tags?.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // 정렬
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title)
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return new Date(a.dueDate) - new Date(b.dueDate)
        case 'createdDate':
          return new Date(b.createdAt || b.id) - new Date(a.createdAt || a.id)
        case 'priority':
          const priorityOrder = { high: 0, medium: 1, low: 2 }
          return (priorityOrder[a.priority || 'medium'] || 1) - (priorityOrder[b.priority || 'medium'] || 1)
        default:
          return 0
      }
    })

    return filtered
  }

  const completeAllTodos = () => {
    const filteredTodos = getFilteredTodos()
    const filteredIds = filteredTodos.map(t => t.id)
    setTodos(todos.map(todo =>
      filteredIds.includes(todo.id) ? { ...todo, completed: true } : todo
    ))
  }

  const deleteAllTodos = () => {
    if (window.confirm('현재 보이는 모든 할 일을 삭제하시겠습니까?')) {
      const filteredTodos = getFilteredTodos()
      const filteredIds = filteredTodos.map(t => t.id)
      setTodos(todos.filter(todo => !filteredIds.includes(todo.id)))
      setSelectedTodo(null)
    }
  }

  return (
    // 메인 컨테이너: 화면 전체 높이, 가로 배치(flex), 다크모드 지원
    <div className="flex h-screen bg-white dark:bg-gray-800 transition-colors">
      {/* 사이드바: 데스크탑에서만 표시, 모바일/태블릿에서는 숨김 */}
      <div className="hidden md:block">
        <Sidebar 
          currentView={currentView} 
          setCurrentView={setCurrentView}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      </div>
      
      {/* 할 일 목록: 모든 화면 크기에서 표시 */}
      <TodoList
        todos={getFilteredTodos()}
        addTodo={addTodo}
        toggleTodo={toggleTodo}
        setSelectedTodo={setSelectedTodo}
        selectedTodo={selectedTodo}
        currentView={currentView}
        updateTodo={updateTodo}
        completeAllTodos={completeAllTodos}
        deleteAllTodos={deleteAllTodos}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        setCurrentView={setCurrentView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      
      {/* 상세 패널: 선택된 할 일이 있을 때만 표시, 태블릿 이상에서만 표시 */}
      {selectedTodo && (
        <div className="hidden lg:block">
          <DetailPanel
            todo={selectedTodo}
            updateTodo={updateTodo}
            deleteTodo={deleteTodo}
            addSubtask={addSubtask}
            toggleSubtask={toggleSubtask}
            deleteSubtask={deleteSubtask}
            onClose={() => setSelectedTodo(null)}
          />
        </div>
      )}
      
      {/* 모바일/태블릿용 상세 패널: 하단에서 올라오는 시트 형태 */}
      {selectedTodo && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setSelectedTodo(null)}>
          <div 
            className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-2xl max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <DetailPanel
              todo={selectedTodo}
              updateTodo={updateTodo}
              deleteTodo={deleteTodo}
              addSubtask={addSubtask}
              toggleSubtask={toggleSubtask}
              deleteSubtask={deleteSubtask}
              onClose={() => setSelectedTodo(null)}
              isMobile={true}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
