import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user = {
    name: '',
    address: '',
    phone: '',
    dob: '',
    username: '',
    password: ''
  };

  qrCodeUrl: string | null = null;
  secret: string | null = null;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private api: ApiService, private router: Router) {}

  register() {
    this.api.register(this.user).subscribe({
      next: (res) => {
        this.qrCodeUrl = res.qrCode;
        this.secret = res.secret;
        this.successMessage = 'Usuario registrado. Escanea este código en Google Authenticator o escríbelo.';
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Error al registrar';
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
