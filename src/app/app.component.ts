import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Todo } from './types/todo';
import { TodosService } from './services/todos.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AppComponent implements OnInit {
  _todos: Todo[] = [];
  acriveTodos: Todo[] = [];

  get todos() {
    return this._todos;
  }

  set todos(todos: Todo[]) {
    if (todos === this._todos) return;

    this._todos = todos;
    this.acriveTodos = this._todos.filter((todo) => !todo.completed);
  }

  constructor(private todosServices: TodosService) {}

  ngOnInit(): void {
    this.todosServices.todos$.subscribe((todos) => {
      this.todos = todos;
    });

    this.todosServices.loadTodos().subscribe();
  }

  trackById(i: number, todo: Todo) {
    return todo.id;
  }

  addTodo(newTitle: string) {
    this.todosServices.createTodo(newTitle).subscribe();
  }

  renameTodo(todo: Todo, newTitle: string) {
    this.todosServices
      .updateTodo({
        ...todo,
        title: newTitle,
      })
      .subscribe();
  }

  toggleTodo(todo: Todo) {
    this.todosServices
      .updateTodo({
        ...todo,
        completed: !todo.completed,
      })
      .subscribe();
  }

  deleteTodo(todo: Todo) {
    this.todosServices.deleteTodo(todo).subscribe();
  }
}
