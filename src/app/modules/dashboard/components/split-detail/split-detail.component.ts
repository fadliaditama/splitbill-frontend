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
  tax?: number;
  serviceCharge?: number;
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

  tax = 0;
  serviceCharge = 0;
  splitMethod: 'equally' | 'proportionally' = 'proportionally';

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

          this.tax = data.tax || 0;
          this.serviceCharge = data.serviceCharge || 0;
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
    const hasAnyAllocation = this.bill?.items.some(item => item.participants.length > 0);

  // 2. Jika belum ada alokasi sama sekali, set semua total ke 0
  if (!hasAnyAllocation) {
    const zeroSummary: { [key: string]: number } = {};
    this.participants.forEach(p => zeroSummary[p] = 0);
    this.summary = zeroSummary;
    return; // Hentikan fungsi di sini
  }

    const subtotalPerParticipant: { [key: string]: number } = {};
    let itemsSubtotal = 0;
  
    this.participants.forEach(p => {
      subtotalPerParticipant[p] = 0;
    });
  
    this.bill?.items.forEach(item => {
      if (item.participants.length > 0) {
        itemsSubtotal += item.price;
        const pricePerPerson = item.price / item.participants.length;
        item.participants.forEach(participant => {
          subtotalPerParticipant[participant] += pricePerPerson;
        });
      }
    });
  
    const additionalCosts = this.tax + this.serviceCharge;
    const finalTotals: { [key: string]: number } = {};
    let totalCalculated = 0;
  
    // Hitung total per orang SEBELUM pembulatan
    this.participants.forEach(p => {
      let personTotal = subtotalPerParticipant[p];
      if (additionalCosts > 0) {
        if (this.splitMethod === 'equally') {
          const costPerPerson = this.participants.length > 0 ? additionalCosts / this.participants.length : 0;
          personTotal += costPerPerson;
        } else { // Proportional
          const proportion = itemsSubtotal > 0 ? subtotalPerParticipant[p] / itemsSubtotal : 0;
          const additionalCostForPerson = additionalCosts * proportion;
          personTotal += additionalCostForPerson;
        }
      }
      finalTotals[p] = personTotal;
    });
  
    const roundedTotals: { [key: string]: number } = {};
    let sumOfRoundedShares = 0;
  
    // 1. Bulatkan ke bawah (floor) untuk semua orang
    this.participants.forEach(p => {
      roundedTotals[p] = Math.floor(finalTotals[p]);
      sumOfRoundedShares += roundedTotals[p];
    });
  
    // 2. Hitung total akhir yang sebenarnya (dari struk)
    const grandTotal = (this.bill?.total || itemsSubtotal + additionalCosts);
    
    // 3. Hitung sisa pembulatan
    let remainder = grandTotal - sumOfRoundedShares;
  
    // 4. Distribusikan sisa (misalnya 5 perak) satu per satu ke partisipan
    //    sampai habis, untuk menghindari satu orang menanggung semua sisa.
    let i = 0;
    while (remainder > 0 && this.participants.length > 0) {
      const participantName = this.participants[i % this.participants.length];
      roundedTotals[participantName]++;
      remainder--;
      i++;
    }
    
    this.summary = roundedTotals;
  }

  saveSplit(): void {
    if (!this.bill) return;

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
    
     this.dashboardService.saveSplitDetails(this.bill.id, finalSplitDetails, this.bill.total).subscribe({
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

  deleteItem(itemIndex: number): void {
    if (confirm('Apakah Anda yakin ingin menghapus item ini?')) {
      this.bill?.items.splice(itemIndex, 1);
      this.calculateSummary(); // Hitung ulang total setelah item dihapus
    }
  }

  editItem(itemIndex: number): void {
    if (!this.bill) return;

    const item = this.bill.items[itemIndex];
    const newName = prompt('Masukkan nama item baru:', item.name);
    if (newName === null) return; // User menekan cancel

    const newPriceRaw = prompt('Masukkan harga baru:', item.price.toString());
    if (newPriceRaw === null) return; // User menekan cancel

    const newPrice = parseFloat(newPriceRaw);

    if (newName && !isNaN(newPrice)) {
      this.bill.items[itemIndex].name = newName;
      this.bill.items[itemIndex].price = newPrice;
      this.calculateSummary(); // Hitung ulang
    } else {
      alert('Nama atau harga tidak valid.');
    }
  }

  addItem(): void {
    if (!this.bill) return;

    const newName = prompt('Masukkan nama item baru:');
    if (!newName) return;

    const newPriceRaw = prompt('Masukkan harga item:');
    if (!newPriceRaw) return;

    const newPrice = parseFloat(newPriceRaw);

    if (newName && !isNaN(newPrice) && newPrice >= 0) {
      this.bill.items.push({
        name: newName,
        price: newPrice,
        quantity: 1, // Default kuantitas ke 1
        participants: []
      });
      // Tidak perlu calculateSummary() di sini karena belum ada yang dialokasikan
    } else {
      alert('Nama atau harga tidak valid.');
    }
  }

}
