import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { DashboardService } from '../../services/dashboard.service'; // Pastikan nama service ini benar

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  selectedFile: File | null = null;
  uploadResult: any = null;
  isLoading = false;
  imagePreview: string | ArrayBuffer | null = null; // <-- 1. Tambahkan properti ini

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService
  ) { }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // <-- 2. Tambahkan logika untuk membuat preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);

      // Reset hasil sebelumnya saat file baru dipilih
      this.uploadResult = null;
    }
  }

  onUpload(): void {
    if (!this.selectedFile) return;

    this.isLoading = true;
    this.uploadResult = null;

    this.dashboardService.uploadReceipt(this.selectedFile).subscribe({
      next: (result) => {
        this.uploadResult = {
          items: result.items,
          total: result.total,
          rawText: result.rawText
        };
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Upload failed:', err);
        this.isLoading = false;
        alert('Gagal mengunggah atau memproses file. Lihat console untuk detail.');
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}