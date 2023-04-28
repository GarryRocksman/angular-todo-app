import { Component, EventEmitter, Output } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss'],
})
export class TodoFormComponent {
  @Output() save = new EventEmitter<string>();

  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value || '';
      const hasWhitespace = value.trim().length === 0 && value.length > 0;
      return hasWhitespace ? { whitespace: true } : null;
    };
  }

  todoFrom = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(3),
        this.noWhitespaceValidator(),
      ],
    }),
  });

  get title() {
    return this.todoFrom.get('title') as FormControl;
  }

  handleFromSubmit() {
    if (this.todoFrom.invalid) {
      return;
    }

    this.save.emit(this.title.value);
    this.todoFrom.reset();
  }
}
