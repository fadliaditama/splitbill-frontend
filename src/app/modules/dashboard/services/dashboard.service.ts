import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/ocr`;


  constructor(private http: HttpClient) { }

  getMyBills(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-bills`);
  }

  getBillById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  saveSplitDetails(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/split/${id}`, data);
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
