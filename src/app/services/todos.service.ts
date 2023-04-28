import { Injectable } from '@angular/core';
import { Todo } from '../types/todo';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';

const todosFromServer: Todo[] = [
  { id: 1, title: 'HTML + CSS', completed: false },
  { id: 2, title: 'JS', completed: true },
  { id: 3, title: 'React', completed: false },
  { id: 4, title: 'Angular', completed: true },
];

const USER_ID = 6325;
const BASE_URL = 'https://mate.academy/students-api/';

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  private refresh$$ = new BehaviorSubject<Todo[]>([]);
  todos$ = this.refresh$$.asObservable();

  constructor(private http: HttpClient) {}

  loadTodos() {
    return this.http
      .get<Todo[]>(`${BASE_URL}/todos?userId=${USER_ID}`)
      .pipe(tap((todos) => this.refresh$$.next(todos)));
  }

  createTodo(title: string) {
    return this.http
      .post<Todo>(`${BASE_URL}/todos?userId=${USER_ID}`, {
        title,
        completed: false,
      })
      .pipe(
        withLatestFrom(this.refresh$$),
        tap(([createdTodo, todos]) => {
          this.refresh$$.next([...todos, createdTodo]);
        })
      );
  }

  updateTodo(todo: Todo) {
    return this.http.patch<Todo>(`${BASE_URL}/todos/${todo.id}`, todo).pipe(
      withLatestFrom(this.refresh$$),
      tap(([updatedTodo, todos]) => {
        this.refresh$$.next(
          todos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
        );
      })
    );
  }

  deleteTodo({ id }: Todo) {
    return this.http.delete<Todo>(`${BASE_URL}/todos/${id}`).pipe(
      withLatestFrom(this.refresh$$),
      tap(([_, todos]) => {
        this.refresh$$.next(todos.filter((todo) => todo.id !== id));
      })
    );
  }
}
