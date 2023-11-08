import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class GetTextByPdfService {

  constructor(
    private http: HttpClient
  ) { }

  getTextByPdf() {
    //preencha o campo ip com o ip do seu computador
    this.http.get(`http://${environment.ip}:5000/read-pdf`).subscribe((data) => {
      console.log(data);
    });
  }

}
