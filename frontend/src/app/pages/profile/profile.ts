import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { PostsService } from '../../core/services/posts.service';
import { PostCard } from '../../shared/post-card/post-card';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, PostCard],
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

  ngOnInit() {
    this.postsService.getMisPosts().subscribe({
      next: (posts) => {
        this.misPosts = posts;
        this.cdr.detectChanges();
      },
      error: (err) => console.log('Error:', err)
    });
  }

  onDeleted(id: string) {
    this.misPosts = this.misPosts.filter(p => p._id !== id);
    this.cdr.detectChanges();
  }

  onLiked(updatedPost: any) {
    const idx = this.misPosts.findIndex(p => p._id === updatedPost._id);
    if (idx !== -1) this.misPosts[idx] = updatedPost;
    this.cdr.detectChanges();
  }
}