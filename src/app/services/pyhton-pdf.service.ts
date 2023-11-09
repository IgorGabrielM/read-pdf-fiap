import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PyhtonPdfService {

  constructor(
    private http: HttpClient
  ) { }

  getTextByPdf(): Observable<any> {
    return this.http.get(`http://${environment.ip}:5000/read-pdf`);
  }

  sendPdf(body: any) {
    return this.http.post(`http://127.0.0.1:5000/upload`, body)
  }

  sendPdfBase64(body: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post(`http://127.0.0.1:5000/base64`, body, httpOptions)
  }
}
