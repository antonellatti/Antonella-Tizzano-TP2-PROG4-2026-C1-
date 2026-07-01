import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../core/services/users.service';
import { Modal } from '../../shared/modal/modal.component';
import { AuthService } from '../../core/services/auth.service';
import { HoverHighlightDirective } from '../../shared/directives/hover-highlight.directive';


@Component({
  selector: 'app-dashboard-users',
  standalone: true,
  imports: [CommonModule, FormsModule, Modal, HoverHighlightDirective],
  templateUrl: 'dashboard-users.html',
  styleUrl: 'dashboard-users.css'
})
export class DashboardUsers implements OnInit {
  router = inject(Router);
  usersService = inject(UsersService);
  cdr = inject(ChangeDetectorRef);
  auth = inject(AuthService);

  usuarios: any[] = [];
  loading = false;
  mostrarForm = false;
  creando = false;

  modal = { visible: false, message: '', type: 'info' as 'success' | 'error' | 'info' };

  nuevoUsuario = {
    nombre: '', apellido: '', email: '', username: '',
    password: '', fechaNacimiento: '', descripcion: '', rol: 'usuario',
  };
  profileFile: File | null = null;
  profileFileName = '';

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.loading = true;
    this.usersService.getUsers().subscribe({
      next: (users) => {
        this.usuarios = users;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) { this.profileFile = file; this.profileFileName = file.name; }
  }

  crearUsuario() {
    this.creando = true;
    this.cdr.detectChanges();

    const fd = new FormData();
    Object.entries(this.nuevoUsuario).forEach(([key, value]) => fd.append(key, value));
    if (this.profileFile) fd.append('fotoPerfil', this.profileFile);

    this.usersService.createUser(fd).subscribe({
      next: () => {
        this.creando = false;
        this.mostrarForm = false;
        this.nuevoUsuario = {
          nombre: '', apellido: '', email: '', username: '',
          password: '', fechaNacimiento: '', descripcion: '', rol: 'usuario',
        };
        this.profileFile = null;
        this.profileFileName = '';
        this.modal = { visible: true, message: 'Usuario creado correctamente', type: 'success' };
        this.cargarUsuarios();
      },
      error: (err) => {
        this.creando = false;
        this.modal = { visible: true, message: err.error?.message || 'Error al crear usuario', type: 'error' };
        this.cdr.detectChanges();
      }
    });
  }

  toggleEstado(usuario: any) {
    const action = usuario.activo
      ? this.usersService.deshabilitarUser(usuario._id)
      : this.usersService.habilitarUser(usuario._id);

    action.subscribe({
      next: () => {
        usuario.activo = !usuario.activo;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.modal = { visible: true, message: err.error?.message || 'Error al actualizar usuario', type: 'error' };
        this.cdr.detectChanges();
      }
    });
  }
}