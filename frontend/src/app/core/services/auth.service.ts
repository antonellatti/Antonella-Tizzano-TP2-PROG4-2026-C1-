import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:3000/api';

  register(formData: FormData) {
    return this.http.post(`${this.apiUrl}/auth/register`, formData);
  }

  login(email: string, password: string) {
    return this.http.post<{ token: string; user: any }>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUser(): any {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  }

  autorizar() {
    return this.http.post<any>(`${this.apiUrl}/auth/autorizar`, {});
  }
  
  refrescarToken() {
    return this.http.post<{ token: string }>(`${this.apiUrl}/auth/refrescar`, {});
  }
}