import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { FlightAgencyComponent } from './flight-agency/flight-agency.component';
import { FlightReservationsComponent } from './flight-reservations/flight-reservations.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'flight-agency', component: FlightAgencyComponent },
    { path: 'flight-reservations', component: FlightReservationsComponent }
];
