import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  selectedFile: File | null = null;
  uploadResult: any = null;
  isLoading = false;

  constructor(private dashboardService: DashboardService,
    private authService: AuthService) { }

  ngOnInit(): void {
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] ?? null;
  }

  onUpload(): void {
    if (!this.selectedFile) return;

    this.isLoading = true;
    this.uploadResult = null;

    // 3. Panggil fungsi dari OcrService
    this.dashboardService.uploadReceipt(this.selectedFile).subscribe({
      next: (result) => {
        this.uploadResult = result;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Upload failed:', err);
        this.isLoading = false;
        alert('Gagal mengunggah file.');
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }

}
