import { Component, OnInit } from '@angular/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { PyhtonPdfService } from '../services/pyhton-pdf.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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
  textToShow: string = ''
  speed: number = 0.6
  textOnArray: string[] = []

  initializeRead: boolean = false

  constructor(
    private pyhtonPdfService: PyhtonPdfService,

    private loadingCtrl: LoadingController,
    private toastController: ToastController,
    private sanitizer: DomSanitizer
  ) {
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
    this.speed = ev.detail.value / 2
  }

  pinFormatter(value: number) {
    return `${value}%`;
  }

  confirm() {
    this.initializeRead = true
    setTimeout(() => {
      this.loadText()
    }, 2000)
  }

  loadText() {
    this.pyhtonPdfService.getTextByPdf().subscribe(({ result: text }) => {
      this.text = text
      this.textToShow = text
    })
  }

  sanitizeHtml(html: string): SafeHtml {
    this.textOnArray = this.text.split(' ')
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  readArray(index = 0) {
    if (index >= this.textOnArray.length) {
      return;
    }

    const arrayStr = [this.textOnArray[index], this.textOnArray[index + 1], this.textOnArray[index + 2]];
    const strToRead = arrayStr.join(' ');

    const readNow = strToRead

    this.textToShow = this.text.replace(readNow, `<span style=\'background-color:var(--ion-color-primary);color:white;padding:3px;border-radius:5px\;font-weight:600'>${readNow}</span>`)

    this.textSpeak(strToRead)
      .then(() => {
        this.readArray(index + 3);
      })
  }

  stop() {
    TextToSpeech.stop()
  }

  async textSpeak(text: string) {
    TextToSpeech.getSupportedVoices().then((test) => console.log(test.voices.filter((vc) => vc.lang === 'pt')))
    await TextToSpeech.speak({
      text: text,
      rate: this.speed,
      pitch: 1.0,
      lang: 'pt',
      volume: 1.0,
      category: 'ambient',
    })
  }
}
