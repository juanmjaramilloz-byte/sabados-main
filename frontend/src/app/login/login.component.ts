import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = {
    username: '',
    password: ''
  };

  step = 1; // 1: username/password, 2: 2FA
  userId: number | null = null;
  twoFactorToken = '';
  errorMessage = '';

  constructor(private api: ApiService, private router: Router) {}

  login() {
    this.api.login(this.credentials).subscribe({
      next: (res) => {
        this.userId = res.userId;
        this.step = 2;
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Error al iniciar sesión';
      }
    });
  }

  verify2fa() {
    if (!this.userId) return;
    const token = this.twoFactorToken.trim();
    if (!token) {
      this.errorMessage = 'Por favor ingresa el código 2FA';
      return;
    }

    this.api.verify2fa({ userId: this.userId, token }).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/flight-agency']);
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Token inválido';
      }
    });
  }
}
