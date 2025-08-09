import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-history-detail',
  templateUrl: './history-detail.component.html',
  styleUrls: ['./history-detail.component.scss']
})
export class HistoryDetailComponent implements OnInit {
  bill: any = null;
  isLoading = true;
  participantNames: string[] = [];

  constructor(private route: ActivatedRoute,
    private router: Router,
    private dashboardService: DashboardService) { }

  ngOnInit(): void {
    const billId = this.route.snapshot.paramMap.get('id');
    if (billId) {
      this.dashboardService.getBillById(billId).subscribe({
        next: (data) => {
          this.bill = data;
          if (data.splitDetails) {
            this.participantNames = Object.keys(data.splitDetails);
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
          alert('Gagal memuat riwayat tagihan.');
          this.router.navigate(['/dashboard']);
        }
      });
    }
  }

  getAdditionalCostsShare(participantName: string): number {
    if (!this.bill || !this.bill.splitDetails || !this.bill.splitDetails[participantName]) {
      return 0;
    }

    const participantData = this.bill.splitDetails[participantName];
    const itemsTotal = participantData.items.reduce(
      (sum: number, item: { paidAmount: number }) => sum + item.paidAmount, 
      0
    );
    
    // Porsi biaya tambahan adalah total tagihan orang tsb dikurangi total itemnya
    return participantData.total - itemsTotal;
  }

  onDelete(): void {
    if (!this.bill) return;

    const isConfirmed = confirm('Apakah Anda yakin ingin menghapus transaksi ini? Aksi ini tidak bisa dibatalkan.');

    if (isConfirmed) {
      this.isLoading = true; // Tampilkan loading
      this.dashboardService.deleteBill(this.bill.id).subscribe({
        next: () => {
          alert('Transaksi berhasil dihapus.');
          this.router.navigate(['/dashboard']); // Kembali ke dashboard
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Gagal menghapus:', err);
          alert('Gagal menghapus transaksi.');
        }
      });
    }
  }

}
