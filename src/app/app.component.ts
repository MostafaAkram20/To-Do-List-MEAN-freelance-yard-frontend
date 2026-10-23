import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from './services/todo.service';
import { Todo } from './models/todo.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'MEAN To-Do Application';
  todos: Todo[] = [];
  newTodoTitle = '';
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.todoService.getTodos().subscribe({
      next: (data) => {
        this.todos = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load todos:', err);
        this.errorMessage = 'Could not load tasks from server. Please verify backend is running.';
        this.isLoading = false;
      }
    });
  }

  addTodo(): void {
    const trimmedTitle = this.newTodoTitle.trim();
    if (!trimmedTitle) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.todoService.addTodo(trimmedTitle).subscribe({
      next: (createdTodo) => {
        this.todos.unshift(createdTodo);
        this.newTodoTitle = '';
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Failed to add todo:', err);
        this.errorMessage = 'Could not add task. Please try again.';
        this.isSubmitting = false;
      }
    });
  }
}
