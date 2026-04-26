import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Task } from '../models/task.model';
import { ApiResponse } from '../models/api-response.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/tasks`;

  getTasks(): Observable<Task[]> {
    return this.http.get<ApiResponse<Task[]>>(this.apiUrl).pipe(
      map(res => res.data)
    );
  }

  getTask(id: number): Observable<Task> {
    return this.http.get<ApiResponse<Task>>(`${this.apiUrl}/${id}`).pipe(
      map(res => res.data)
    );
  }

  createTask(task: Task): Observable<void> {
    return this.http.post<void>(this.apiUrl, task);
  }

  updateTask(id: number, task: Task): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, task);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
