import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-flight-agency',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './flight-agency.component.html',
  styleUrls: ['./flight-agency.component.css']
})
export class FlightAgencyComponent implements OnInit {
  flight = {
    destination: '',
    origin: '',
    departure_date: '',
    return_date: '',
    passengers: 1
  };

  reservas: any[] = [];
  mostrarReservas = false;
  successMessage = '';
  errorMessage = '';

  private mockUrl = 'https://5d33a6e5-d843-48b0-833c-0c30c79a2f20.mock.pstmn.io/agencia/reserva';

  constructor(private api: ApiService, private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  toggleReservas() {
    this.mostrarReservas = !this.mostrarReservas;

    if (this.mostrarReservas && this.reservas.length === 0) {
      this.http.get<any>(this.mockUrl).subscribe({
        next: (res) => {
          // El mock devuelve un objeto, lo metemos en un array
          this.reservas = Array.isArray(res) ? res : [res];
        },
        error: () => {
          this.errorMessage = 'Error al cargar las reservas';
          this.mostrarReservas = false;
        }
      });
    }
  }

  bookFlight() {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.http.get<any>(this.mockUrl).subscribe({
      next: (res) => {
        if (res.estado === 'confirmada') {
          this.successMessage = `¡Reserva confirmada! ID: ${res.reserva_id} — Total: $${res.total}`;
          this.errorMessage = '';
          this.flight = { destination: '', origin: '', departure_date: '', return_date: '', passengers: 1 };
        } else {
          this.errorMessage = res.mensaje || 'Error al crear la reserva';
          this.successMessage = '';
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.mensaje || 'Error al conectar con el servidor';
        this.successMessage = '';
      }
    });
  }
}