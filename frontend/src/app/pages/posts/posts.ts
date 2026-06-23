import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
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
  cdr = inject(ChangeDetectorRef);

  posts: any[] = [];
  total = 0;
  orden = 'fecha';
  limit = 5;
  offset = 0;
  loading = false;

  modal = { visible: false, message: '', type: 'info' as 'success' | 'error' | 'info' };

  nuevoPost = { titulo: '', descripcion: '' };
  postFile: File | null = null;
  postFileName = '';
  creando = false;

  ngOnInit() { this.cargarPosts(); }

  cargarPosts() {
    this.loading = true;
    this.postsService.getPosts({ orden: this.orden, offset: this.offset, limit: this.limit }).subscribe({
      next: (res: any) => {
        this.posts = res.posts;
        this.total = Number(res.total);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('Error cargando posts:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  cambiarOrden(orden: string) {
    this.orden = orden;
    this.offset = 0;
    this.cargarPosts();
    this.cdr.detectChanges();
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
      next: (res) => {
        console.log('Post creado:', res);
        this.nuevoPost = { titulo: '', descripcion: '' };
        this.postFile = null;
        this.postFileName = '';
        this.creando = false;
        this.offset = 0;
        this.cargarPosts();
      },
      error: (err) => {
        this.creando = false;
        this.cdr.detectChanges();
      }
    });
  }

  onDeleted(id: string) {
    this.posts = this.posts.filter(p => p._id !== id);
    this.total--;
    this.cdr.detectChanges();
  }

  onLiked(updatedPost: any) {
    const idx = this.posts.findIndex(p => p._id === updatedPost._id);
    if (idx !== -1) this.posts[idx] = updatedPost;
    this.cdr.detectChanges();
  }
}