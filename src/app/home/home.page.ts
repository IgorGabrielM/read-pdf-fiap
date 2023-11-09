import { Component, OnInit } from '@angular/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { SpeechRecognition } from "@capacitor-community/speech-recognition";
import { PyhtonPdfService } from '../services/pyhton-pdf.service';
import { LoadingController, ToastController } from '@ionic/angular';

interface IInputFile {
  file: File;
  fileAsBase64: string | ArrayBuffer;
  id: number;
}
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [PyhtonPdfService]
})
export class Tab1Page implements OnInit {
  inputFile: IInputFile;
  pdfModel: any

  text = 'Envie um pdf'
  speed: number = 1

  initializeRead: boolean = false

  constructor(
    private pyhtonPdfService: PyhtonPdfService,

    private loadingCtrl: LoadingController,
    private toastController: ToastController
  ) {
    SpeechRecognition.requestPermission();
    TextToSpeech.openInstall()
  }

  ngOnInit(): void {
    this.loadText()
  }

  async handleFile(event: any): Promise<void> {
    if (event.target.files[0].type === 'application/pdf') {
      this.inputFile = {} as IInputFile;

      this.inputFile = {
        file: event.target.files[0],
      } as IInputFile;

      const loading = await this.loadingCtrl.create({
        message: 'Preparando pdf...',
      });
      loading.present();
      const formData = new FormData()
      formData.append('file', this.inputFile.file)

      this.pyhtonPdfService.sendPdf(formData).subscribe(() => { }, () => {
        loading.dismiss();
      })

      console.log(this.inputFile)

    } else {
      const toast = await this.toastController.create({
        message: 'Por favor selecione um arquivo no formato PDF.',
        duration: 1500,
        position: 'bottom',
        color: 'danger'
      });

      await toast.present();
    }
  }

  onIonChange(ev: any) {
    this.speed = ev.detail.value
  }

  pinFormatter(value: number) {
    return `${value}%`;
  }

  loadText() {
    this.pyhtonPdfService.getTextByPdf().subscribe((text) => {
      this.text = text
    })
  }

  async textSpeak() {
    await TextToSpeech.speak({
      text: 'This is a sample text.',
      lang: 'en-US',
      rate: this.speed,
      pitch: 1.0,
      volume: 1.0,
      category: 'ambient',
    })
  }
}
