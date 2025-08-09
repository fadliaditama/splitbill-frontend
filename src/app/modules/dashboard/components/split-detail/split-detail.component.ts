import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { ActivatedRoute, Router } from '@angular/router';

interface Item {
  name: string;
  price: number;
  quantity: number;
  // Properti baru untuk melacak siapa saja yang ikut patungan item ini
  participants: string[]; 
}

interface Bill {
  id: string;
  imageUrl: string;
  items: Item[];
  total: number;
  storeName: string;
  purchaseDate: string;
  splitDetails?: any;
}

@Component({
  selector: 'app-split-detail',
  templateUrl: './split-detail.component.html',
  styleUrls: ['./split-detail.component.scss']
})
export class SplitDetailComponent implements OnInit {
  bill: Bill | null = null;
  isLoading = true;

  participants: string[] = [];
  newParticipantName = '';
  
  summary: { [key: string]: number } = {};

  constructor(private route: ActivatedRoute,
    private router: Router,
    private dashboardService: DashboardService) { }

  ngOnInit(): void {
    const billId = this.route.snapshot.paramMap.get('id');
    if (billId) {
      this.dashboardService.getBillById(billId).subscribe({
        next: (data: Bill) => {
          // Inisialisasi properti 'participants' untuk setiap item
          data.items.forEach(item => item.participants = []); 
          this.bill = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
          alert('Gagal memuat detail tagihan.');
          this.router.navigate(['/dashboard']);
        }
      });
    }
  }

  addParticipant(): void {
    if (this.newParticipantName && !this.participants.includes(this.newParticipantName)) {
      this.participants.push(this.newParticipantName.trim());
      this.newParticipantName = '';
      this.calculateSummary(); // Hitung ulang ringkasan
    }
  }

  removeParticipant(name: string): void {
    this.participants = this.participants.filter(p => p !== name);
    // Hapus partisipan dari semua item
    this.bill?.items.forEach(item => {
      item.participants = item.participants.filter(p => p !== name);
    });
    this.calculateSummary();
  }

  toggleItemParticipant(item: Item, participantName: string): void {
    const index = item.participants.indexOf(participantName);
    if (index > -1) {
      // Jika sudah ada, hapus
      item.participants.splice(index, 1);
    } else {
      // Jika belum ada, tambahkan
      item.participants.push(participantName);
    }
    this.calculateSummary();
  }

  isParticipantInItem(item: Item, participantName: string): boolean {
    return item.participants.includes(participantName);
  }
  
  calculateSummary(): void {
    const newSummary: { [key: string]: number } = {};
    this.participants.forEach(p => newSummary[p] = 0);

    this.bill?.items.forEach(item => {
      if (item.participants.length > 0) {
        const pricePerPerson = item.price / item.participants.length;
        item.participants.forEach(participant => {
          newSummary[participant] += pricePerPerson;
        });
      }
    });
    
    this.summary = newSummary;
  }

  saveSplit(): void {
    if (!this.bill) return;

    // ▼▼▼ DI SINI PERUBAHANNYA ▼▼▼
    const finalSplitDetails: { [key: string]: { total: number, items: any[] } } = {};

    // Inisialisasi struktur untuk setiap partisipan
    this.participants.forEach(p => {
      finalSplitDetails[p] = {
        total: this.summary[p] || 0,
        items: []
      };
    });

    // Loop melalui setiap item belanja untuk mengalokasikannya
    this.bill.items.forEach(item => {
      if (item.participants.length > 0) {
        const pricePerPerson = item.price / item.participants.length;
        
        item.participants.forEach(participant => {
          // Tambahkan detail item ke partisipan yang bersangkutan
          finalSplitDetails[participant].items.push({
            name: item.name,
            quantity: item.quantity,
            originalPrice: item.price,
            paidAmount: pricePerPerson // Jumlah yang dia bayar untuk item ini
          });
        });
      }
    });
    // ▲▲▲ AKHIR DARI PERUBAHAN ▲▲▲
    
    this.dashboardService.saveSplitDetails(this.bill.id, finalSplitDetails).subscribe({
      next: () => {
        alert('Hasil pembagian berhasil disimpan!');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Gagal menyimpan:', err);
        alert('Gagal menyimpan hasil pembagian.');
      }
    });
  }

}
