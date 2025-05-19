import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ColorService, Color } from '../services/color.service';

@Component({
  selector: 'app-color-mix',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './color-mix.component.html',
  styleUrls: ['./color-mix.component.scss'],
})
export class ColorMixComponent implements OnInit {
  /** Lista de colores disponibles */
  colors = signal<Color[]>([]);
  /** Selección del primer color */
  pickA = signal<Color | undefined>(undefined);
  /** Selección del segundo color */
  pickB = signal<Color | undefined>(undefined);
  /** Hex resultado de la mezcla */
  mixedHex = signal<string>('#ffffff');
  /** Nombre oficial del color mezclado */
  resultName = signal<string>('');
  /** Ruta al audio oficial del color mezclado */
  resultAudio = signal<string>('');

  /**
   * comboMap
   * Mapeo de pares de colores a su mezcla “oficial”.
   * La clave es "ColorA+ColorB" en inglés.
   */
  private comboMap: Record<string, { name: string; audio: string }> = {
    'Red+Green': { name: 'Brown', audio: 'assets/audio/brown.mp3' },
    'Green+Red': { name: 'Brown', audio: 'assets/audio/brown.mp3' },
    'Red+Blue': { name: 'Purple', audio: 'assets/audio/purple.mp3' },
    'Blue+Red': { name: 'Purple', audio: 'assets/audio/purple.mp3' },
    'Green+Blue': { name: 'Blue', audio: 'assets/audio/blue.mp3' },
    'Blue+Green': { name: 'Blue', audio: 'assets/audio/blue.mp3' },
    'Blue+Blue': { name: 'Blue', audio: 'assets/audio/blue.mp3' },
    'Red+Red': { name: 'Red', audio: 'assets/audio/red.mp3' },
    'Green+Green': { name: 'Green', audio: 'assets/audio/green.mp3' },
  };

  constructor(public colorService: ColorService) {}

  ngOnInit() {
    // Carga inicial de la lista de colores
    this.colors.set(this.colorService.colors());
  }

  /**
   * playAudio
   * Reproduce cualquier archivo de audio dado su URL.
   */
  playAudio(audioUrl: string) {
    const audio = new Audio(audioUrl);
    audio.play();
  }

  /**
   * parseHex
   * Convierte un string "#rrggbb" en objeto {r,g,b}.
   */
  private parseHex(hex: string) {
    const clean = hex.replace('#', '');
    return {
      r: parseInt(clean.substring(0, 2), 16),
      g: parseInt(clean.substring(2, 4), 16),
      b: parseInt(clean.substring(4, 6), 16),
    };
  }

  /**
   * toHex
   * Convierte un objeto {r,g,b} en un string "#rrggbb".
   */
  private toHex(rgb: { r: number; g: number; b: number }) {
    const to2 = (v: number) => v.toString(16).padStart(2, '0');
    return `#${to2(rgb.r)}${to2(rgb.g)}${to2(rgb.b)}`; // #rrggbb
  }

  /**
   * mixColors
   * Mezcla los dos colores seleccionados:
   * 1) Calcula el promedio de sus canales RGB → mixedHex
   * 2) Busca en comboMap para nombre/audio "oficial"
   * 3) Si no existe, usa concatenación como fallback sin audio
   */
  mixColors() {
    const a = this.pickA();
    const b = this.pickB();
    if (!a || !b) return;

    // 1) Mezcla RGB
    const hexA = this.colorService.getOptionColor(a.english);
    const hexB = this.colorService.getOptionColor(b.english);
    const rgbA = this.parseHex(hexA);
    const rgbB = this.parseHex(hexB);
    const avg = {
      r: Math.round((rgbA.r + rgbB.r) / 2),
      g: Math.round((rgbA.g + rgbB.g) / 2),
      b: Math.round((rgbA.b + rgbB.b) / 2),
    };
    this.mixedHex.set(this.toHex(avg));

    // 2) Determinar nombre/audio oficial
    const key = `${a.english}+${b.english}`;
    const combo = this.comboMap[key];
    if (combo) {
      this.resultName.set(combo.name);
      this.resultAudio.set(combo.audio);
    } else {
      // fallback
      this.resultName.set(`${a.english} + ${b.english}`);
      this.resultAudio.set('');
    }
  }

  /**
   * playAudioForResult
   * Reproduce el audio oficial del color resultante, si existe.
   */
  playAudioForResult() {
    const url = this.resultAudio();
    if (url) {
      const audio = new Audio(url);
      audio.play();
    }
  }

  /**
   * getContrastColor
   * Devuelve '#000' o '#fff' según la luminosidad de un hex.
   */
  getContrastColor(hex: string): string {
    const { r, g, b } = this.parseHex(hex);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? '#000000' : '#FFFFFF';
  }
}
