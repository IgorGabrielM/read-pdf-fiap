import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PyhtonPdfService {

  constructor(
    private http: HttpClient
  ) { }

  getTextByPdf(): Observable<any> {
    return this.http.get(`http://127.0.0.1:5000/read-pdf`);
  }

  sendPdf(body: any) {
    return this.http.post(`http://127.0.0.1:5000/upload`, body)
  }
}
