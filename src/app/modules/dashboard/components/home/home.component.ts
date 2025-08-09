import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { DashboardService } from '../../services/dashboard.service'; // Pastikan nama service ini benar
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  selectedFile: File | null = null;
  uploadResult: any = null;
  isLoading = false;
  imagePreview: string | ArrayBuffer | null = null;

  billsHistory: any[] = [];
  isLoadingHistory = true;

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.isLoadingHistory = true;
    this.dashboardService.getMyBills().subscribe({
      next: (history) => {
        this.billsHistory = history;
        this.isLoadingHistory = false;
      },
      error: (err) => {
        console.error('Gagal memuat riwayat:', err);
        this.isLoadingHistory = false;
        alert('Gagal memuat riwayat transaksi.');
      }
    });
  }

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
        this.router.navigate(['/dashboard/split', result.id]); 
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