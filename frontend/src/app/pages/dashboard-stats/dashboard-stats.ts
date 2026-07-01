import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostsService } from '../../core/services/posts.service';
import { Chart, registerables } from 'chart.js';
import { AuthService } from '../../core/services/auth.service';
import { HoverHighlightDirective } from '../../shared/directives/hover-highlight.directive';


Chart.register(...registerables);
@Component({
  selector: 'app-dashboard-stats',
  standalone: true,
  imports: [CommonModule, FormsModule, HoverHighlightDirective],
  templateUrl: 'dashboard-stats.html',
  styleUrl: 'dashboard-stats.css'
})
export class DashboardStats implements OnInit, AfterViewInit, OnDestroy {
  router = inject(Router);
  postsService = inject(PostsService);
  cdr = inject(ChangeDetectorRef);
  auth = inject(AuthService);

  desde = '';
  hasta = '';

  private charts: Chart[] = [];

  ngOnInit() {}

  ngAfterViewInit() {
    this.cargarTodo();
  }

  ngOnDestroy() {
    this.charts.forEach(c => c.destroy());
  }

  cargarTodo() {
    this.charts.forEach(c => c.destroy());
    this.charts = [];
    setTimeout(() => {
      this.cargarPostsPorUsuario();
      this.cargarComentariosPorFecha();
      this.cargarComentariosPorPost();
    }, 50);
  }

  cargarPostsPorUsuario() {
    this.postsService.getStatPostsPorUsuario(this.desde, this.hasta).subscribe({
      next: (data) => {
        const labels = data.map(d => d.username);
        const valores = data.map(d => d.cantidad);
        this.crearGrafico('chartPostsUsuario', 'pie', labels, valores, 'Publicaciones por usuario');
      }
    });
  }

  cargarComentariosPorFecha() {
    this.postsService.getStatComentariosPorFecha(this.desde, this.hasta).subscribe({
      next: (data) => {
        const labels = data.map(d => d._id);
        const valores = data.map(d => d.cantidad);
        this.crearGrafico('chartComentariosFecha', 'line', labels, valores, 'Comentarios por día');
      }
    });
  }

  cargarComentariosPorPost() {
    this.postsService.getStatComentariosPorPost(this.desde, this.hasta).subscribe({
      next: (data) => {
        const labels = data.map(d => d.titulo);
        const valores = data.map(d => d.cantidad);
        this.crearGrafico('chartComentariosPost', 'bar', labels, valores, 'Comentarios por publicación');
      }
    });
  }

  crearGrafico(id: string, tipo: any, labels: string[], valores: number[], titulo: string) {
    const canvas = document.getElementById(id) as HTMLCanvasElement;
    if (!canvas) return;

    const colores = [
      '#6c63ff', '#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff',
      '#f72585', '#7209b7', '#3a0ca3', '#4361ee', '#4cc9f0'
    ];

    const chart = new Chart(canvas, {
      type: tipo,
      data: {
        labels,
        datasets: [{
          label: titulo,
          data: valores,
          backgroundColor: tipo === 'line' ? 'rgba(108,99,255,0.1)' : colores,
          borderColor: tipo === 'line' ? '#6c63ff' : colores,
          borderWidth: 2,
          fill: tipo === 'line',
          tension: 0.4,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          title: { display: true, text: titulo, font: { size: 14 } }
        }
      }
    });

    this.charts.push(chart);
  }
}