import { Component } from '@angular/core';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-admin-dashboard',
  imports: [],
  templateUrl: './admin-dashboard.html',
  standalone: true,
})
export class AdminDashboard {
  constructor(protected readonly auth: Auth) {}
}
