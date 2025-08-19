import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { ActivatedRoute, Router } from '@angular/router';

// Interfaces
interface Item {
  name: string;
  price: number;
  quantity: number;
  participants: string[];
}

interface Bill {
  id: string;
  imageUrl: string;
  items: Item[];
  total: number;
  storeName: string;
  storeLocation: string; // Pastikan properti ini ada
  purchaseDate: string;
  tax?: number;
  serviceCharge?: number;
  splitDetails?: { [key: string]: { total: number; items: any[] } };
}

@Component({
  selector: 'app-split-detail',
  templateUrl: './split-detail.component.html',
  styleUrls: ['./split-detail.component.scss']
})
export class SplitDetailComponent implements OnInit {
  bill: Bill | null = null;
  isLoading = true; // Diubah ke true
  isSaving = false; // Properti baru untuk loading simpan
  purchaseDateForInput: string = '';

  participants: string[] = [];
  newParticipantName = '';
  
  summary: { [key: string]: number } = {};

  tax = 0;
  serviceCharge = 0;
  splitMethod: 'equally' | 'proportionally' = 'proportionally';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dashboardService: DashboardService
  ) { }

  ngOnInit(): void {
    const billId = this.route.snapshot.paramMap.get('id');
    if (billId) {
      this.dashboardService.getBillById(billId).subscribe({
        next: (data: Bill) => {
          this.bill = data;
          this.tax = data.tax || 0;
          this.serviceCharge = data.serviceCharge || 0;

          // Format tanggal agar sesuai dengan input type="date" (YYYY-MM-DD)
          if (data.purchaseDate) {
            // Cek jika formatnya sudah benar, jika tidak, format ulang
            try {
              this.purchaseDateForInput = new Date(data.purchaseDate).toISOString().split('T')[0];
            } catch (e) {
              console.error("Invalid date format from backend:", data.purchaseDate);
            }
          }
          
          this.reconstructStateFromHistory(data);
          this.isLoading = false; // Set loading false setelah data diterima
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
  
  // Fungsi untuk mengupdate tanggal di objek `bill` saat input berubah
  updateBillDate(newDate: string): void {
    if (this.bill && newDate) {
      this.bill.purchaseDate = newDate;
    }
  }

  addParticipant(): void {
    if (this.newParticipantName && !this.participants.includes(this.newParticipantName)) {
      this.participants.push(this.newParticipantName.trim());
      this.newParticipantName = '';
      this.calculateSummary();
    }
  }

  removeParticipant(name: string): void {
    this.participants = this.participants.filter(p => p !== name);
    this.bill?.items.forEach(item => {
      item.participants = item.participants.filter(p => p !== name);
    });
    this.calculateSummary();
  }

  toggleItemParticipant(item: Item, participantName: string): void {
    const index = item.participants.indexOf(participantName);
    if (index > -1) {
      item.participants.splice(index, 1);
    } else {
      item.participants.push(participantName);
    }
    this.calculateSummary();
  }

  isParticipantInItem(item: Item, participantName: string): boolean {
    return item.participants.includes(participantName);
  }
  
  calculateSummary(): void {
    if (!this.bill) return;

    const hasAnyAllocation = this.bill.items.some(item => item.participants.length > 0);
    if (!hasAnyAllocation) {
      const zeroSummary: { [key: string]: number } = {};
      this.participants.forEach(p => zeroSummary[p] = 0);
      this.summary = zeroSummary;
      return;
    }

    const subtotalPerParticipant: { [key: string]: number } = {};
    let itemsSubtotal = 0;
    this.participants.forEach(p => { subtotalPerParticipant[p] = 0; });
    this.bill.items.forEach(item => {
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
    this.participants.forEach(p => {
      let personTotal = subtotalPerParticipant[p];
      if (additionalCosts > 0) {
        if (this.splitMethod === 'equally') {
          const costPerPerson = this.participants.length > 0 ? additionalCosts / this.participants.length : 0;
          personTotal += costPerPerson;
        } else {
          const proportion = itemsSubtotal > 0 ? subtotalPerParticipant[p] / itemsSubtotal : 0;
          const additionalCostForPerson = additionalCosts * proportion;
          personTotal += additionalCostForPerson;
        }
      }
      finalTotals[p] = personTotal;
    });

    const roundedTotals: { [key: string]: number } = {};
    let sumOfRoundedShares = 0;
    this.participants.forEach(p => {
      roundedTotals[p] = Math.floor(finalTotals[p]);
      sumOfRoundedShares += roundedTotals[p];
    });

    const grandTotal = this.bill.total;
    let remainder = grandTotal - sumOfRoundedShares;

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
    if (!this.bill || this.isSaving) return;
    this.isSaving = true;

    const finalSplitDetails: { [key: string]: { total: number, items: any[] } } = {};
    this.participants.forEach(p => {
      finalSplitDetails[p] = { total: this.summary[p] || 0, items: [] };
    });
    this.bill.items.forEach(item => {
      if (item.participants.length > 0) {
        const pricePerPerson = item.price / item.participants.length;
        item.participants.forEach(participant => {
          finalSplitDetails[participant].items.push({
            name: item.name,
            quantity: item.quantity,
            originalPrice: item.price,
            paidAmount: pricePerPerson
          });
        });
      }
    });
    
    // Buat payload dari objek `bill` yang sudah terupdate
    const payload = {
      splitDetails: finalSplitDetails,
      total: this.bill.total,
      storeName: this.bill.storeName,
      storeLocation: this.bill.storeLocation,
      purchaseDate: this.bill.purchaseDate
    };
    
    this.dashboardService.saveSplitDetails(this.bill.id, payload).subscribe({
      next: () => {
        this.isSaving = false;
        alert('Hasil pembagian berhasil disimpan!');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Gagal menyimpan:', err);
        alert('Gagal menyimpan hasil pembagian.');
      }
    });
  }

  deleteItem(itemIndex: number): void {
    if (confirm('Apakah Anda yakin ingin menghapus item ini?')) {
      this.bill?.items.splice(itemIndex, 1);
      this.calculateSummary();
    }
  }

  editItem(itemIndex: number): void {
    if (!this.bill) return;
    const item = this.bill.items[itemIndex];
    const newName = prompt('Masukkan nama item baru:', item.name);
    if (newName === null) return;
    const newPriceRaw = prompt('Masukkan harga baru:', item.price.toString());
    if (newPriceRaw === null) return;
    const newPrice = parseFloat(newPriceRaw);
    if (newName && !isNaN(newPrice)) {
      this.bill.items[itemIndex].name = newName;
      this.bill.items[itemIndex].price = newPrice;
      this.calculateSummary();
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
      this.bill.items.push({ name: newName, price: newPrice, quantity: 1, participants: [] });
    } else {
      alert('Nama atau harga tidak valid.');
    }
  }

  reconstructStateFromHistory(bill: Bill): void {
    const savedSplitDetails = bill.splitDetails;
    if (!savedSplitDetails) {
      bill.items.forEach(item => item.participants = []);
      return;
    }
    this.participants = Object.keys(savedSplitDetails);
    const participantItemsMap: { [key: string]: string[] } = {};
    this.participants.forEach(name => {
      participantItemsMap[name] = savedSplitDetails[name].items.map(item => item.name);
    });
    bill.items.forEach(item => {
      item.participants = [];
      this.participants.forEach(name => {
        if (participantItemsMap[name].includes(item.name)) {
          item.participants.push(name);
        }
      });
    });
    this.calculateSummary();
  }
}