import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/loading/loading').then(m => m.Loading) },
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login) },
  { path: 'register', loadComponent: () => import('./pages/register/register').then(m => m.Register) },
  { path: 'posts', loadComponent: () => import('./pages/posts/posts').then(m => m.Posts), canActivate: [authGuard] },
  { path: 'profile', loadComponent: () => import('./pages/profile/profile').then(m => m.MiPerfil), canActivate: [authGuard] },
  { path: 'posts/:id', loadComponent: () => import('./pages/post-detail/post-detail').then(m => m.PostDetail), canActivate: [authGuard] },
  { path: 'dashboard/usuarios', loadComponent: () => import('./pages/dashboard-users/dashboard-users').then(m => m.DashboardUsers), canActivate: [authGuard, adminGuard] },
  { path: 'dashboard/stats', loadComponent: () => import('./pages/dashboard-stats/dashboard-stats').then(m => m.DashboardStats), canActivate: [authGuard, adminGuard] },
  { path: '**', redirectTo: '' },
];