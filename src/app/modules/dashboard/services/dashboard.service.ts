import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:3000/ocr';


  constructor(private http: HttpClient) { }

  getMyBills(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-bills`);
  }

  getBillById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  saveSplitDetails(id: string, details: any, total: number): Observable<any> {
    const payload = {
        splitDetails: details,
        total: total
    };
    return this.http.patch(`${this.apiUrl}/split/${id}`, payload);
}

  uploadReceipt(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    // Interceptor akan otomatis menambahkan token Authorization
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  deleteBill(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
