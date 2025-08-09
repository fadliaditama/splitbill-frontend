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
          // Ambil nama partisipan dari kunci objek splitDetails
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

}
