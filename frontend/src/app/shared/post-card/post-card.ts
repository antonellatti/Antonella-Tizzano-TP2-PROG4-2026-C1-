import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { PostsService } from '../../core/services/posts.service';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'post-card.html',
  styleUrl: 'post-card.css'
})
export class PostCard {
  @Input() post: any;
  @Output() deleted = new EventEmitter<string>();
  @Output() liked = new EventEmitter<any>();

  auth = inject(AuthService);
  postsService = inject(PostsService);

  get currentUser() { return this.auth.getUser(); }

  get yaLiked(): boolean {
    return this.post.likes?.some((id: string) => id === this.currentUser?._id);
  }

  get esAutor(): boolean {
    return this.post.autor?._id === this.currentUser?._id;
  }

  toggleLike() {
    const action = this.yaLiked
      ? this.postsService.removeLike(this.post._id)
      : this.postsService.addLike(this.post._id);
    action.subscribe({ next: (post) => this.liked.emit(post) });
  }

  eliminar() {
    this.postsService.deletePost(this.post._id).subscribe({
      next: () => this.deleted.emit(this.post._id)
    });
  }
}