import React, { useState, useEffect } from "react"
import "./App.css"
import APIHelper from "./APIHelper.js"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash, faCheck } from '@fortawesome/free-solid-svg-icons'



function App() {
  const [todos, setTodos] = useState([])
  const [todo, setTodo] = useState("")


  useEffect(() => {
    const fetchTodoAndSetTodos = async () => {
      const todos = await APIHelper.getAllTodos()
      setTodos(todos)
    }
    fetchTodoAndSetTodos()
  }, [])

  const createTodo = async e => {
    e.preventDefault()
    if (!todo) {
      alert("please enter something")
      return
    }
    if (todos.some(({ task }) => task === todo)) {
      alert(`Task: ${todo} already exists`)
      return
    }
    const newTodo = await APIHelper.createTodo(todo)
    setTodos([...todos, newTodo])
  }

  const deleteTodo = async (e, id) => {
    try {
      e.stopPropagation()
      await APIHelper.deleteTodo(id)
      setTodos(todos.filter(({ _id: i }) => id !== i))
    } catch (err) { }
  }

  const updateTodo = async (e, id) => {
    e.stopPropagation()
    const payload = {
      completed: !todos.find(todo => todo._id === id).completed,
    }
    const updatedTodo = await APIHelper.updateTodo(id, payload)
    setTodos(todos.map(todo => (todo._id === id ? updatedTodo : todo)))
  }

  return (
    <div className="App container">
      <h1>React Todolist App</h1>
      <div className="input-container">
        <input
          autoFocus="true"
          id="todo-input"
          type="text"
          value={todo}
          onChange={({ target }) => setTodo(target.value)}
        />
        <button id="todo-submit" type="submit" onClick={(createTodo)}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>

      <ul id="todos">
        {todos.map(({ _id, task, completed }, i) => (
          <li className={completed ? "completed todo" : "unfinished todo"}

          ><span
            key={i}
            onClick={e => updateTodo(e, _id)}
            className={completed ? "completed checktodo" : "unfinished checktodo"}><FontAwesomeIcon icon={faCheck} />
            </span>
            {task} <span className="deletetodo" onClick={e => deleteTodo(e, _id)}>
              <FontAwesomeIcon icon={faTrash} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App