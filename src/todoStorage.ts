import { TodoItem } from '@/todoItem'

interface Storable {
  getItem (key: string): string | null;
  setItem (key: string, value: string): void;
}

const STORAGE_KEY = "todoList-vst"

export default class TodoStorage {
  get nextId (): number {
    return this.fetchAll().length + 1
  }

  constructor(private stroage: Storable = localStorage) { }

  public fetchAll (): TodoItem[] {
    const todos = JSON.parse(this.stroage.getItem(STORAGE_KEY) || '[]') as TodoItem[]
    todos.forEach((todo, index) => todo.id = index)
    return todos
  }

  public save (todos: TodoItem[]) {
    this.stroage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}