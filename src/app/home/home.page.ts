import { Component, OnInit } from '@angular/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { SpeechRecognition } from "@capacitor-community/speech-recognition";
import { GetTextByPdfService } from '../services/get-text-by-pdf.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [GetTextByPdfService]
})
export class Tab1Page implements OnInit {
  text = 'Texto para teste teste teste teste teste teste'
  speed: number = 1


  pdfPath = "/src/assets/Cap12 - The Framework_RevFinal.pdf";

  constructor(
    private getTextByPdfService: GetTextByPdfService
  ) {
    SpeechRecognition.requestPermission();
    TextToSpeech.openInstall()
  }

  ngOnInit(): void {
    this.loadText()
  }

  loadText() {
    this.getTextByPdfService.getTextByPdf()
  }

  pinFormatter(value: number) {
    return `${value}%`;
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

  onIonChange(ev: any) {
    console.log(ev.detail.value)
    this.speed = ev.detail.value
  }

  /*
  const getSupportedLanguages = async () => {
  const languages = await TextToSpeech.getSupportedLanguages();
};

const getSupportedVoices = async () => {
  const voices = await TextToSpeech.getSupportedVoices();
};

const isLanguageSupported = async (lang: string) => {
  const isSupported = await TextToSpeech.isLanguageSupported({ lang });
};
  */

}
