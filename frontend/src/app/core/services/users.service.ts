import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

  getUsers() {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

  createUser(formData: FormData) {
    return this.http.post<any>(`${this.apiUrl}/users`, formData);
  }

  deshabilitarUser(id: string) {
    return this.http.delete<any>(`${this.apiUrl}/users/${id}`);
  }

  habilitarUser(id: string) {
    return this.http.post<any>(`${this.apiUrl}/users/${id}/habilitar`, {});
  }
}