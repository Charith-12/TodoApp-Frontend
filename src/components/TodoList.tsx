import React, { useEffect, useState } from "react";
import { Todo } from "../models/Todo";
import {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
} from "../services/TodoService";

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>("");

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
      title: newTodo,
      //description: "",
      isCompleted: false,
    };

    await addTodo(todo);
    fetchTodos();
    setNewTodo("");
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

  return (
    <div>
      <h1>Todo List</h1>
      <ul>
        {todos.map((todo) => (
          <li key={todo.todoId}>
            <input
              type="checkbox"
              checked={todo.isCompleted}
              onChange={() => handleToggleTodo(todo.todoId)}
            />
            {todo.title}
            <button onClick={() => handleDeleteTodo(todo.todoId)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      <div>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button onClick={handleAddTodo}>Add Todo</button>
      </div>
    </div>
  );
};

export default TodoList;
