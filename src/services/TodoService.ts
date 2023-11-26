import axios from "axios";
import { Todo } from "../models/Todo";

//const API_URL = "https://localhost:5001/api/todo";
const API_URL = "https://localhost:7089/api/Todo";

export const getTodos = async (): Promise<Todo[]> => {
  const response = await axios.get<Todo[]>(API_URL);
  return response.data;
};

export const addTodo = async (todo: Todo): Promise<Todo> => {
  const response = await axios.post<Todo>(API_URL, todo);
  return response.data;
};

export const updateTodo = async (id: number, todo: Todo): Promise<void> => {
  await axios.put(`${API_URL}/${id}`, todo);
};

export const deleteTodo = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
