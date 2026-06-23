import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

  getPosts(params: { orden?: string; offset?: number; limit?: number; autorId?: string }) {
    let httpParams = new HttpParams();
    if (params.orden) httpParams = httpParams.set('orden', params.orden);
    if (params.offset !== undefined) httpParams = httpParams.set('offset', params.offset);
    if (params.limit !== undefined) httpParams = httpParams.set('limit', params.limit);
    if (params.autorId) httpParams = httpParams.set('autorId', params.autorId);
    return this.http.get<{ posts: any[]; total: number }>(`${this.apiUrl}/posts`, { params: httpParams });
  }

  createPost(formData: FormData) {
    return this.http.post<any>(`${this.apiUrl}/posts`, formData);
  }

  deletePost(id: string) {
    return this.http.delete<any>(`${this.apiUrl}/posts/${id}`);
  }

  addLike(id: string) {
    return this.http.post<any>(`${this.apiUrl}/posts/${id}/like`, {});
  }

  removeLike(id: string) {
    return this.http.delete<any>(`${this.apiUrl}/posts/${id}/like`);
  }

  getMisPosts() {
    return this.http.get<any[]>(`${this.apiUrl}/posts/mis-posts`);
  }
}