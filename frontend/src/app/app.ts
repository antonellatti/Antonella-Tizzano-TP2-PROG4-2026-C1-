import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { SessionService } from './core/services/session.service';
import { SessionModal } from './shared/session-modal/session-modal.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SessionModal],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  router = inject(Router);
  sessionService = inject(SessionService);
  auth = inject(AuthService);
  cdr = inject(ChangeDetectorRef);

  sessionModalVisible = false;

  ngOnInit() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      const rutasProtegidas = ['/posts', '/profile', '/post-detail'];
      const estaEnRutaProtegida = rutasProtegidas.some(r => e.urlAfterRedirects.startsWith(r));

      if (estaEnRutaProtegida && this.auth.isLoggedIn()) {
        this.sessionService.iniciarContador(
          () => { this.sessionModalVisible = true; this.cdr.detectChanges(); },
          (extender) => { this.sessionService.responderModal(extender); this.sessionModalVisible = false; }
        );
      } else {
        this.sessionService.limpiarContadores();
      }
    });
  }
}