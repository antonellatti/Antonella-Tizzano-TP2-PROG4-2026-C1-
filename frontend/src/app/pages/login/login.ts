import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Modal } from '../../shared/modal/modal.component';
import { PasswordToggleDirective } from '../../shared/directives/password-toggle.directive';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, Modal, PasswordToggleDirective],
  templateUrl: 'login.html',
  styleUrl: 'login.css'
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  modal = { visible: false, message: '', type: 'info' as 'success' | 'error' | 'info' };
  loading = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  showModal(message: string, type: 'success' | 'error' | 'info') {
    this.modal = { visible: true, message, type };
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    const { email, password } = this.form.value;
    this.auth.login(email!, password!).subscribe({
      next: () => this.router.navigate(['/posts']),
      error: (err) => {
        this.loading = false;
        this.showModal(err.error?.message || 'Error al iniciar sesión', 'error');
      },
    });
  }
}