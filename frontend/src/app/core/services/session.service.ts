import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private router = inject(Router);
  private auth = inject(AuthService);

  private warningTimer: any;
  private expireTimer: any;
  private modalCallback: ((extender: boolean) => void) | null = null;
  private showModalFn: (() => void) | null = null;

  // 10 min mostrar aviso, 5 min más para expirar = 15 min
  private readonly WARNING_TIME = 1 * 60 * 1000;
  private readonly EXPIRE_TIME = 2 * 60 * 1000;

  iniciarContador(showModalFn: () => void, callback: (extender: boolean) => void) {
    this.limpiarContadores();
    this.showModalFn = showModalFn;
    this.modalCallback = callback;

    this.warningTimer = setTimeout(() => {
      if (this.showModalFn) this.showModalFn();
    }, this.WARNING_TIME);

    this.expireTimer = setTimeout(() => {
      this.cerrarSesion();
    }, this.EXPIRE_TIME);
  }

  responderModal(extender: boolean) {
    if (extender) {
      this.auth.refrescarToken().subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);
          this.reiniciar();
        },
        error: () => this.cerrarSesion()
      });
    } else {
      this.cerrarSesion();
    }
  }

  reiniciar() {
    if (this.showModalFn && this.modalCallback) {
      this.iniciarContador(this.showModalFn, this.modalCallback);
    }
  }

  limpiarContadores() {
    if (this.warningTimer) clearTimeout(this.warningTimer);
    if (this.expireTimer) clearTimeout(this.expireTimer);
  }

  cerrarSesion() {
    this.limpiarContadores();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  isActive(): boolean {
    return !!this.warningTimer || !!this.expireTimer;
  }
  
}