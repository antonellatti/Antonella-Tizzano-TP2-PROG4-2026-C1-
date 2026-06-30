import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { PostsService } from '../../core/services/posts.service';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: 'post-detail.html',
  styleUrl: 'post-detail.css'
})
export class PostDetail implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  auth = inject(AuthService);
  postsService = inject(PostsService);
  cdr = inject(ChangeDetectorRef);

  post: any = null;
  comments: any[] = [];
  total = 0;
  offset = 0;
  limit = 5;

  nuevoComentario = '';
  enviando = false;

  editingCommentId: string | null = null;
  editingMensaje = '';

  get currentUser() { return this.auth.getUser(); }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.router.navigate(['/posts']); return; }
    this.cargarPost(id);
    this.cargarComments(id);
  }

  cargarPost(id: string) {
    this.postsService.getPosts({ offset: 0, limit: 100 }).subscribe({
      next: (res: any) => {
        this.post = res.posts.find((p: any) => p._id === id);
        this.cdr.detectChanges();
      }
    });
  }

  cargarComments(id?: string) {
    const postId = id || this.post?._id;
    if (!postId) return;
    this.postsService.getComments(postId, this.offset, this.limit).subscribe({
      next: (res) => {
        if (this.offset === 0) {
          this.comments = res.comments;
        } else {
          this.comments = [...this.comments, ...res.comments];
        }
        this.total = Number(res.total);
        this.cdr.detectChanges();
      }
    });
  }

  cargarMas() {
    this.offset += this.limit;
    this.cargarComments();
  }

  enviarComentario() {
    if (!this.nuevoComentario.trim()) return;
    this.enviando = true;
    this.cdr.detectChanges();
    this.postsService.createComment(this.post._id, this.nuevoComentario).subscribe({
      next: (comment) => {
        this.comments = [comment, ...this.comments];
        this.total++;
        this.nuevoComentario = '';
        this.enviando = false;
        this.cdr.detectChanges();
      },
      error: () => { 
        this.enviando = false;
        this.cdr.detectChanges();
      }
    });
  }

  iniciarEdicion(comment: any) {
    this.editingCommentId = comment._id;
    this.editingMensaje = comment.mensaje;
  }

  cancelarEdicion() {
    this.editingCommentId = null;
    this.editingMensaje = '';
  }

  guardarEdicion(comment: any) {
    if (!this.editingMensaje.trim()) return;
    this.postsService.updateComment(this.post._id, comment._id, this.editingMensaje).subscribe({
      next: (updated) => {
        const idx = this.comments.findIndex(c => c._id === comment._id);
        if (idx !== -1) this.comments[idx] = updated;
        this.editingCommentId = null;
        this.cdr.detectChanges();
      }
    });
  }

  esAutorComentario(comment: any): boolean {
    return comment.autor?._id === this.currentUser?._id;
  }

  get hayMas(): boolean {
    return this.comments.length < this.total;
  }
  
  get yaLiked(): boolean {
    return this.post?.likes?.some((id: string) => id === this.currentUser?._id);
  }
  
  toggleLike() {
    const action = this.yaLiked
      ? this.postsService.removeLike(this.post._id)
      : this.postsService.addLike(this.post._id);
    action.subscribe({
      next: (updatedPost) => {
        this.post = updatedPost;
        this.cdr.detectChanges();
      }
    });
  }

}