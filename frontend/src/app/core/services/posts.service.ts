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

  getComments(postId: string, offset = 0, limit = 5) {
    return this.http.get<{ comments: any[]; total: number }>(
      `${this.apiUrl}/posts/${postId}/comments?offset=${offset}&limit=${limit}`
    );
  }
  
  createComment(postId: string, mensaje: string) {
    return this.http.post<any>(`${this.apiUrl}/posts/${postId}/comments`, { mensaje });
  }
  
  updateComment(postId: string, commentId: string, mensaje: string) {
    return this.http.put<any>(`${this.apiUrl}/posts/${postId}/comments/${commentId}`, { mensaje });
  }

  deleteComment(postId: string, commentId: string) {
    return this.http.delete<any>(`${this.apiUrl}/posts/${postId}/comments/${commentId}`);
  }
  
  getStatPostsPorUsuario(desde?: string, hasta?: string) {
    let url = `${this.apiUrl}/stats/posts-por-usuario`;
    if (desde || hasta) url += `?desde=${desde || ''}&hasta=${hasta || ''}`;
    return this.http.get<any[]>(url);
  }
  
  getStatComentariosPorFecha(desde?: string, hasta?: string) {
    let url = `${this.apiUrl}/stats/comentarios-por-fecha`;
    if (desde || hasta) url += `?desde=${desde || ''}&hasta=${hasta || ''}`;
    return this.http.get<any[]>(url);
  }
  
  getStatComentariosPorPost(desde?: string, hasta?: string) {
    let url = `${this.apiUrl}/stats/comentarios-por-post`;
    if (desde || hasta) url += `?desde=${desde || ''}&hasta=${hasta || ''}`;
    return this.http.get<any[]>(url);
  }
}