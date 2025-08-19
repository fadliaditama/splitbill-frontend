import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  error: string | null = null;
  isLoading: boolean = false;
  
  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    return password && confirmPassword && password.value === confirmPassword.value 
      ? null 
      : { mismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid || this.isLoading) {
      if (this.registerForm.errors?.['mismatch']) {
        this.error = "Konfirmasi password tidak cocok.";
      }
      return;
    }
    
    this.error = null;
    this.isLoading = true;
    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        this.isLoading = false;
        this.error = error.error.message || 'Terjadi kesalahan saat registrasi.';
      }
    });
  }
}
