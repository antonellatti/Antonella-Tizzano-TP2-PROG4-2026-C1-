import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { PostsService } from '../../core/services/posts.service';
import { PostCard } from '../../shared/post-card/post-card';
import { TooltipDirective } from '../../shared/directives/tooltip.directive';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, PostCard, TooltipDirective],
  templateUrl: 'profile.html',
  styleUrl: 'profile.css'
})
export class MiPerfil implements OnInit {
  auth = inject(AuthService);
  router = inject(Router);
  postsService = inject(PostsService);
  cdr = inject(ChangeDetectorRef);

  user = this.auth.getUser();
  misPosts: any[] = [];
  total = 0;
  offset = 0;
  limit = 3;

  ngOnInit() {
    this.cargarPosts();
  }

  cargarPosts() {
    this.postsService.getPosts({ autorId: this.user._id, offset: this.offset, limit: this.limit }).subscribe({
      next: (res: any) => {
        this.misPosts = res.posts;
        this.total = Number(res.total);
        this.cdr.detectChanges();
      },
      error: (err) => console.log('Error:', err)
    });
  }

  paginaAnterior() {
    if (this.offset > 0) { this.offset -= this.limit; this.cargarPosts(); }
  }

  paginaSiguiente() {
    if (this.offset + this.limit < this.total) { this.offset += this.limit; this.cargarPosts(); }
  }

  get paginaActual() { return Math.floor(this.offset / this.limit) + 1; }
  get totalPaginas() { return Math.ceil(this.total / this.limit); }

  onDeleted(id: string) {
    this.misPosts = this.misPosts.filter(p => p._id !== id);
    this.total--;
    this.cdr.detectChanges();
  }

  onLiked(updatedPost: any) {
    const idx = this.misPosts.findIndex(p => p._id === updatedPost._id);
    if (idx !== -1) this.misPosts[idx] = updatedPost;
    this.cdr.detectChanges();
  }
}