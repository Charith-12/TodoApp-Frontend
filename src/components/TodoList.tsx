import React, { useEffect, useState } from "react";
import { Todo } from "../models/Todo";
import {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
} from "../services/TodoService";
import "./TodoList.css"; // Import the CSS file for styling

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<Partial<Todo>>({
    title: "",
    description: "",
    isCompleted: false,
  });
  const [editTodo, setEditTodo] = useState<Partial<Todo> | null>(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const todos = await getTodos();
    setTodos(todos);
  };

  const handleAddTodo = async () => {
    const todo: Todo = {
      todoId: 0, // The server will assign the ID
      title: newTodo.title || "",
      description: newTodo.description || "",
      isCompleted: newTodo.isCompleted || false,
    };

    await addTodo(todo);
    fetchTodos();
    setNewTodo({
      title: "",
      description: "",
      isCompleted: false,
    });
  };

  const handleToggleTodo = async (id: number) => {
    const todoToUpdate = todos.find((todo) => todo.todoId === id);

    if (todoToUpdate) {
      await updateTodo(id, {
        ...todoToUpdate,
        isCompleted: !todoToUpdate.isCompleted,
      });
      fetchTodos();
    }
  };

  const handleDeleteTodo = async (id: number) => {
    await deleteTodo(id);
    fetchTodos();
  };

  const handleEditClick = (todo: Todo) => {
    setEditTodo({
      todoId: todo.todoId,
      title: todo.title,
      description: todo.description,
      isCompleted: todo.isCompleted,
    });
  };

  const handleSaveEdit = async () => {
    if (editTodo) {
      await updateTodo(editTodo.todoId!, {
        todoId: editTodo.todoId || -1,
        title: editTodo.title || "",
        description: editTodo.description || "",
        isCompleted: editTodo.isCompleted || false,
      });
      fetchTodos();
      setEditTodo(null);
    }
  };

  const handleCancelEdit = () => {
    setEditTodo(null);
  };

  return (
    <div className="todo-container">
      <h1>Todo List</h1>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.todoId} className="todo-item">
            {editTodo?.todoId === todo.todoId ? (
              <div className="edit-container">
                <input
                  type="text"
                  value={editTodo.title}
                  onChange={(e) =>
                    setEditTodo({ ...editTodo, title: e.target.value })
                  }
                  className="edit-input"
                />
                <input
                  type="text"
                  value={editTodo.description}
                  onChange={(e) =>
                    setEditTodo({ ...editTodo, description: e.target.value })
                  }
                  className="edit-input"
                />
                <button className="edit-button save" onClick={handleSaveEdit}>
                  Save
                </button>
                <button
                  className="edit-button cancel"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="view-container">
                <input
                  type="checkbox"
                  checked={todo.isCompleted}
                  onChange={() => handleToggleTodo(todo.todoId)}
                />
                <div className="todo-details">
                  <strong>{todo.title}</strong>
                  <p>{todo.description}</p>
                </div>
                <div className="button-container">
                  <button
                    className="action-button edit"
                    onClick={() => handleEditClick(todo)}
                  >
                    Edit
                  </button>
                  <button
                    className="action-button delete"
                    onClick={() => handleDeleteTodo(todo.todoId)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      <div className="add-todo-container">
        <label>Title:</label>
        <input
          type="text"
          value={newTodo.title}
          onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
          className="add-input"
        />
        <label>Description:</label>
        <input
          type="text"
          value={newTodo.description}
          onChange={(e) =>
            setNewTodo({ ...newTodo, description: e.target.value })
          }
          className="add-input"
        />
        <label>Completed:</label>
        <input
          type="checkbox"
          checked={newTodo.isCompleted}
          onChange={(e) =>
            setNewTodo({ ...newTodo, isCompleted: e.target.checked })
          }
        />
        <button className="add-button" onClick={handleAddTodo}>
          Add Todo
        </button>
      </div>
    </div>
  );
};

export default TodoList;
