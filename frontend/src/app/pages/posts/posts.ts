import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { PostsService } from '../../core/services/posts.service';
import { PostCard } from '../../shared/post-card/post-card';
import { Modal } from '../../shared/modal/modal.component';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule, FormsModule, PostCard, Modal],
  templateUrl: 'posts.html',
  styleUrl: 'posts.css'
})
export class Posts implements OnInit {
  auth = inject(AuthService);
  router = inject(Router);
  postsService = inject(PostsService);

  posts: any[] = [];
  total = 0;
  orden = 'fecha';
  limit = 5;
  offset = 0;
  loading = false;

  modal = { visible: false, message: '', type: 'info' as 'success' | 'error' | 'info' };

  // Nuevo post
  nuevoPost = { titulo: '', descripcion: '' };
  postFile: File | null = null;
  postFileName = '';
  creando = false;

  ngOnInit() { this.cargarPosts(); }

  cargarPosts() {
    this.loading = true;
    this.postsService.getPosts({ orden: this.orden, offset: this.offset, limit: this.limit }).subscribe({
      next: (res) => { this.posts = res.posts; this.total = res.total; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  cambiarOrden(orden: string) {
    this.orden = orden;
    this.offset = 0;
    this.cargarPosts();
  }

  paginaAnterior() {
    if (this.offset > 0) { this.offset -= this.limit; this.cargarPosts(); }
  }

  paginaSiguiente() {
    if (this.offset + this.limit < this.total) { this.offset += this.limit; this.cargarPosts(); }
  }

  get paginaActual() { return Math.floor(this.offset / this.limit) + 1; }
  get totalPaginas() { return Math.ceil(this.total / this.limit); }

  onPostFile(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) { this.postFile = file; this.postFileName = file.name; }
  }

  crearPost() {
    if (!this.nuevoPost.titulo || !this.nuevoPost.descripcion) return;
    this.creando = true;
    const fd = new FormData();
    fd.append('titulo', this.nuevoPost.titulo);
    fd.append('descripcion', this.nuevoPost.descripcion);
    if (this.postFile) fd.append('imagen', this.postFile);

    this.postsService.createPost(fd).subscribe({
      next: () => {
        this.nuevoPost = { titulo: '', descripcion: '' };
        this.postFile = null;
        this.postFileName = '';
        this.creando = false;
        this.offset = 0;
        this.cargarPosts();
      },
      error: () => { this.creando = false; }
    });
  }

  onDeleted(id: string) {
    this.posts = this.posts.filter(p => p._id !== id);
    this.total--;
  }

  onLiked(updatedPost: any) {
    const idx = this.posts.findIndex(p => p._id === updatedPost._id);
    if (idx !== -1) this.posts[idx] = updatedPost;
  }
}