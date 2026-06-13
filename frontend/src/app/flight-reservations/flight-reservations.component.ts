import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-flight-reservations',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './flight-reservations.component.html',
  styleUrls: ['./flight-reservations.component.css']
})
export class FlightReservationsComponent implements OnInit {
  reservations: any[] = [];
  errorMessage = '';

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadReservations();
  }

  loadReservations() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'No se encontró token de sesión.';
      return;
    }

    this.api.getFlights(token).subscribe({
      next: (res) => {
        this.reservations = res.flights || [];
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'No se pudieron cargar las reservas.';
      }
    });
  }

  goBack() {
    this.router.navigate(['/flight-agency']);
  }
}
