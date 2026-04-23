import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { PermissionService } from '../../services/permission.service';

import { TranslatePipe } from '../../translate.pipe';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskListComponent {
  private taskService = inject(TaskService);
  public permissionService = inject(PermissionService);
  private fb = inject(FormBuilder);

  tasks = signal<Task[]>([]);
  isAddingTask = signal(false);

  taskForm = this.fb.group({
    title: ['', Validators.required],
    description: ['']
  });

  constructor() {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe(tasks => this.tasks.set(tasks));
  }

  addTask(): void {
    if (!this.permissionService.canCreate('tasks') || this.taskForm.invalid) return;

    const newTask = this.taskForm.value as Task;

    this.taskService.createTask(newTask).subscribe(() => {
      this.taskForm.reset();
      this.isAddingTask.set(false);
      this.loadTasks();
    });
  }

  toggleTask(task: Task, event: Event): void {
    if (!this.permissionService.canUpdate('tasks')) return;

    const checked = (event.target as HTMLInputElement).checked;

    this.taskService
      .updateTask(task.id!, { ...task, completed: checked })
      .subscribe(() => this.loadTasks());
  }

  deleteTask(id: number): void {
    if (!this.permissionService.canDelete('tasks')) return;

    this.taskService.deleteTask(id).subscribe(() => this.loadTasks());
  }
}