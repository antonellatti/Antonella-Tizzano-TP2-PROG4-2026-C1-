import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (visible) {
      <div class="modal-backdrop" (click)="close()"></div>
      <div class="modal-box" [class]="'modal-' + type">
        <div class="modal-icon">
          @if (type === 'success') { <i class="bi bi-check-circle-fill"></i> }
          @if (type === 'error') { <i class="bi bi-x-circle-fill"></i> }
          @if (type === 'info') { <i class="bi bi-info-circle-fill"></i> }
        </div>
        <p class="modal-message">{{ message }}</p>
        <button class="btn-modal" (click)="close()">Aceptar</button>
      </div>
    }
  `,
  styleUrl: 'modal.component.css'
})
export class Modal {
  @Input() visible = false;
  @Input() message = '';
  @Input() type: 'success' | 'error' | 'info' = 'info';

  close() { this.visible = false; }
}