import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  standalone: true,
})
export class Login {
  username = '';
  password = '';
  error = '';
  loading = false;

  constructor(
    private readonly auth: Auth,
    private readonly router: Router,
  ) {}

  submit(): void {
    this.error = '';
    this.loading = true;
    this.auth.login(this.username, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/hotels']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message ?? 'Invalid credentials';
      },
    });
  }
}
