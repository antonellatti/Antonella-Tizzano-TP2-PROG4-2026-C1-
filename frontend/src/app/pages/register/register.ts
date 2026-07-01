import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Modal } from '../../shared/modal/modal.component';
import { PasswordToggleDirective } from '../../shared/directives/password-toggle.directive';

function passwordMatch(control: AbstractControl) {
  const p = control.get('password')?.value;
  const r = control.get('repeatPassword')?.value;
  return p === r ? null : { mismatch: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, Modal, PasswordToggleDirective],
  templateUrl: 'register.html',
  styleUrl: 'register.css'
})
export class Register {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  modal = { visible: false, message: '', type: 'info' as 'success' | 'error' | 'info' };
  loading = false;
  selectedFileName = '';
  profileFile: File | null = null;

  form = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/(?=.*[A-Z])(?=.*\d)/),
    ]],
    repeatPassword: ['', Validators.required],
    fechaNacimiento: ['', Validators.required],
    descripcion: [''],
  }, { validators: passwordMatch });

  showModal(message: string, type: 'success' | 'error' | 'info') {
    this.modal = { visible: true, message, type };
  }

  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.profileFile = file;
      this.selectedFileName = file.name;
    }
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;

    const fd = new FormData();
    const v = this.form.value;
    fd.append('nombre', v.nombre!);
    fd.append('apellido', v.apellido!);
    fd.append('email', v.email!);
    fd.append('username', v.username!);
    fd.append('password', v.password!);
    fd.append('fechaNacimiento', v.fechaNacimiento!);
    fd.append('descripcion', v.descripcion || '');
    if (this.profileFile) fd.append('fotoPerfil', this.profileFile);

    this.auth.register(fd).subscribe({
      next: () => {
        this.loading = false;
        this.showModal('¡Registro exitoso! Ya podés iniciar sesión.', 'success');
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.loading = false;
        this.showModal(err.error?.message || 'Error al registrarse', 'error');
      },
    });
  }
}