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

  uploadReceipt(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    // Interceptor akan otomatis menambahkan token Authorization
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }
}
