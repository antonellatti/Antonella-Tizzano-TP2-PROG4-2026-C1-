import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-session-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (visible) {
      <div class="modal-backdrop"></div>
      <div class="modal-box">
        <div class="modal-icon"><i class="bi bi-clock-history"></i></div>
        <h3>Sesión a punto de expirar</h3>
        <p>Restan 5 minutos de sesión. ¿Extender?</p>
        <div class="modal-btns">
          <button class="btn-cancelar" (click)="responder(false)">Cerrar sesión</button>
          <button class="btn-extender" (click)="responder(true)">Extender</button>
        </div>
      </div>
    }
  `,
  styleUrl: 'session-modal.component.css'
})
export class SessionModal {
  @Input() visible = false;
  @Output() respuesta = new EventEmitter<boolean>();

  responder(extender: boolean) {
    this.visible = false;
    this.respuesta.emit(extender);
  }
}