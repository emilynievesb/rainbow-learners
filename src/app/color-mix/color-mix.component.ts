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
    'Black+Black': { name: 'Black', audio: 'assets/audio/black.mp3' },
    'Black+Blue': { name: 'Fuchsia', audio: 'assets/audio/fuchsia.mp3' },
    'Black+Brown': { name: 'Gray', audio: 'assets/audio/gray.mp3' },
    'Black+Fuchsia': { name: 'Brown', audio: 'assets/audio/brown.mp3' },
    'Black+Gray': { name: 'Gray', audio: 'assets/audio/gray.mp3' },
    'Black+Green': { name: 'Pink', audio: 'assets/audio/pink.mp3' },
    'Black+Orange': { name: 'Purple', audio: 'assets/audio/purple.mp3' },
    'Black+Pink': { name: 'Brown', audio: 'assets/audio/brown.mp3' },
    'Black+Purple': { name: 'Fuchsia', audio: 'assets/audio/fuchsia.mp3' },
    'Black+Red': { name: 'Purple', audio: 'assets/audio/purple.mp3' },
    'Black+Yellow': { name: 'Pink', audio: 'assets/audio/pink.mp3' },

    'Blue+Black': { name: 'Fuchsia', audio: 'assets/audio/fuchsia.mp3' },
    'Blue+Blue': { name: 'Blue', audio: 'assets/audio/blue.mp3' },
    'Blue+Brown': { name: 'Pink', audio: 'assets/audio/pink.mp3' },
    'Blue+Fuchsia': { name: 'Purple', audio: 'assets/audio/purple.mp3' },
    'Blue+Gray': { name: 'Pink', audio: 'assets/audio/pink.mp3' },
    'Blue+Green': { name: 'Green', audio: 'assets/audio/green.mp3' },
    'Blue+Orange': { name: 'Yellow', audio: 'assets/audio/yellow.mp3' },
    'Blue+Pink': { name: 'Purple', audio: 'assets/audio/purple.mp3' },
    'Blue+Purple': { name: 'Blue', audio: 'assets/audio/blue.mp3' },
    'Blue+Red': { name: 'Purple', audio: 'assets/audio/purple.mp3' },
    'Blue+Yellow': { name: 'Green', audio: 'assets/audio/green.mp3' },

    'Brown+Black': { name: 'Gray', audio: 'assets/audio/gray.mp3' },
    'Brown+Blue': { name: 'Pink', audio: 'assets/audio/pink.mp3' },
    'Brown+Brown': { name: 'Brown', audio: 'assets/audio/brown.mp3' },
    'Brown+Fuchsia': { name: 'Fuchsia', audio: 'assets/audio/fuchsia.mp3' },
    'Brown+Gray': { name: 'Brown', audio: 'assets/audio/brown.mp3' },
    'Brown+Green': { name: 'Purple', audio: 'assets/audio/purple.mp3' },
    'Brown+Orange': { name: 'Blue', audio: 'assets/audio/blue.mp3' },
    'Brown+Pink': { name: 'Fuchsia', audio: 'assets/audio/fuchsia.mp3' },
    'Brown+Purple': { name: 'Pink', audio: 'assets/audio/pink.mp3' },
    'Brown+Red': { name: 'Blue', audio: 'assets/audio/blue.mp3' },
    'Brown+Yellow': { name: 'Purple', audio: 'assets/audio/purple.mp3' },

    'Fuchsia+Black': { name: 'Brown', audio: 'assets/audio/brown.mp3' },
    'Fuchsia+Blue': { name: 'Purple', audio: 'assets/audio/purple.mp3' },
    'Fuchsia+Brown': { name: 'Fuchsia', audio: 'assets/audio/fuchsia.mp3' },
    'Fuchsia+Fuchsia': { name: 'Fuchsia', audio: 'assets/audio/fuchsia.mp3' },
    'Fuchsia+Gray': { name: 'Brown', audio: 'assets/audio/brown.mp3' },
    'Fuchsia+Green': { name: 'Purple', audio: 'assets/audio/purple.mp3' },
    'Fuchsia+Orange': { name: 'Blue', audio: 'assets/audio/blue.mp3' },
    'Fuchsia+Pink': { name: 'Pink', audio: 'assets/audio/pink.mp3' },
    'Fuchsia+Purple': { name: 'Pink', audio: 'assets/audio/pink.mp3' },
    'Fuchsia+Red': { name: 'Green', audio: 'assets/audio/green.mp3' },
    'Fuchsia+Yellow': { name: 'Blue', audio: 'assets/audio/blue.mp3' },

    'Gray+Black': { name: 'Gray', audio: 'assets/audio/gray.mp3' },
    'Gray+Blue': { name: 'Pink', audio: 'assets/audio/pink.mp3' },
    'Gray+Brown': { name: 'Brown', audio: 'assets/audio/brown.mp3' },
    'Gray+Fuchsia': { name: 'Brown', audio: 'assets/audio/brown.mp3' },
    'Gray+Gray': { name: 'Gray', audio: 'assets/audio/gray.mp3' },
    'Gray+Green': { name: 'Pink', audio: 'assets/audio/pink.mp3' },
    'Gray+Orange': { name: 'Purple', audio: 'assets/audio/purple.mp3' },
    'Gray+Pink': { name: 'Fuchsia', audio: 'assets/audio/fuchsia.mp3' },
    'Gray+Purple': { name: 'Fuchsia', audio: 'assets/audio/fuchsia.mp3' },
    'Gray+Red': { name: 'Blue', audio: 'assets/audio/blue.mp3' },
    'Gray+Yellow': { name: 'Purple', audio: 'assets/audio/purple.mp3' },

    'Green+Black': { name: 'Pink', audio: 'assets/audio/pink.mp3' },
    'Green+Blue': { name: 'Green', audio: 'assets/audio/green.mp3' },
    'Green+Brown': { name: 'Purple', audio: 'assets/audio/purple.mp3' },
    'Green+Fuchsia': { name: 'Purple', audio: 'assets/audio/purple.mp3' },
    'Green+Gray': { name: 'Pink', audio: 'assets/audio/pink.mp3' },
    'Green+Green': { name: 'Green', audio: 'assets/audio/green.mp3' },
    'Green+Orange': { name: 'Yellow', audio: 'assets/audio/yellow.mp3' },
    'Green+Pink': { name: 'Blue', audio: 'assets/audio/blue.mp3' },
    'Green+Purple': { name: 'Blue', audio: 'assets/audio/blue.mp3' },
    'Green+Red': { name: 'Brown', audio: 'assets/audio/brown.mp3' },
    'Green+Yellow': { name: 'Yellow', audio: 'assets/audio/yellow.mp3' },

    'Orange+Black': { name: 'Purple', audio: 'assets/audio/purple.mp3' },
    'Orange+Blue': { name: 'Yellow', audio: 'assets/audio/yellow.mp3' },
    'Orange+Brown': { name: 'Blue', audio: 'assets/audio/blue.mp3' },
    'Orange+Fuchsia': { name: 'Blue', audio: 'assets/audio/blue.mp3' },
    'Orange+Gray': { name: 'Purple', audio: 'assets/audio/purple.mp3' },
    'Orange+Green': { name: 'Yellow', audio: 'assets/audio/yellow.mp3' },
    'Orange+Orange': { name: 'Orange', audio: 'assets/audio/orange.mp3' },
    'Orange+Pink': { name: 'Green', audio: 'assets/audio/green.mp3' },
    'Orange+Purple': { name: 'Green', audio: 'assets/audio/green.mp3' },
    'Orange+Red': { name: 'Red', audio: 'assets/audio/red.mp3' },
    'Orange+Yellow': { name: 'Orange', audio: 'assets/audio/orange.mp3' },

    'Pink+Black': { name: 'Brown', audio: 'assets/audio/brown.mp3' },
    'Pink+Blue': { name: 'Purple', audio: 'assets/audio/purple.mp3' },
    'Pink+Brown': { name: 'Fuchsia', audio: 'assets/audio/fuchsia.mp3' },
    'Pink+Fuchsia': { name: 'Pink', audio: 'assets/audio/pink.mp3' },
    'Pink+Gray': { name: 'Fuchsia', audio: 'assets/audio/fuchsia.mp3' },
    'Pink+Green': { name: 'Blue', audio: 'assets/audio/blue.mp3' },
    'Pink+Orange': { name: 'Green', audio: 'assets/audio/green.mp3' },
    'Pink+Pink': { name: 'Pink', audio: 'assets/audio/pink.mp3' },
    'Pink+Purple': { name: 'Purple', audio: 'assets/audio/purple.mp3' },
    'Pink+Red': { name: 'Green', audio: 'assets/audio/green.mp3' },
    'Pink+Yellow': { name: 'Blue', audio: 'assets/audio/blue.mp3' },

    'Purple+Black': { name: 'Fuchsia', audio: 'assets/audio/fuchsia.mp3' },
    'Purple+Blue': { name: 'Blue', audio: 'assets/audio/blue.mp3' },
    'Purple+Brown': { name: 'Pink', audio: 'assets/audio/pink.mp3' },
    'Purple+Fuchsia': { name: 'Pink', audio: 'assets/audio/pink.mp3' },
    'Purple+Gray': { name: 'Fuchsia', audio: 'assets/audio/fuchsia.mp3' },
    'Purple+Green': { name: 'Blue', audio: 'assets/audio/blue.mp3' },
    'Purple+Orange': { name: 'Green', audio: 'assets/audio/green.mp3' },
    'Purple+Pink': { name: 'Purple', audio: 'assets/audio/purple.mp3' },
    'Purple+Purple': { name: 'Purple', audio: 'assets/audio/purple.mp3' },
    'Purple+Red': { name: 'Yellow', audio: 'assets/audio/yellow.mp3' },
    'Purple+Yellow': { name: 'Green', audio: 'assets/audio/green.mp3' },

    'Red+Black': { name: 'Purple', audio: 'assets/audio/purple.mp3' },
    'Red+Blue': { name: 'Purple', audio: 'assets/audio/purple.mp3' },
    'Red+Brown': { name: 'Blue', audio: 'assets/audio/blue.mp3' },
    'Red+Fuchsia': { name: 'Green', audio: 'assets/audio/green.mp3' },
    'Red+Gray': { name: 'Blue', audio: 'assets/audio/blue.mp3' },
    'Red+Green': { name: 'Brown', audio: 'assets/audio/brown.mp3' },
    'Red+Orange': { name: 'Red', audio: 'assets/audio/red.mp3' },
    'Red+Pink': { name: 'Green', audio: 'assets/audio/green.mp3' },
    'Red+Purple': { name: 'Yellow', audio: 'assets/audio/yellow.mp3' },
    'Red+Red': { name: 'Red', audio: 'assets/audio/red.mp3' },
    'Red+Yellow': { name: 'Orange', audio: 'assets/audio/orange.mp3' },

    'Yellow+Black': { name: 'Pink', audio: 'assets/audio/pink.mp3' },
    'Yellow+Blue': { name: 'Green', audio: 'assets/audio/green.mp3' },
    'Yellow+Brown': { name: 'Purple', audio: 'assets/audio/purple.mp3' },
    'Yellow+Fuchsia': { name: 'Blue', audio: 'assets/audio/blue.mp3' },
    'Yellow+Gray': { name: 'Purple', audio: 'assets/audio/purple.mp3' },
    'Yellow+Green': { name: 'Yellow', audio: 'assets/audio/yellow.mp3' },
    'Yellow+Orange': { name: 'Orange', audio: 'assets/audio/orange.mp3' },
    'Yellow+Pink': { name: 'Blue', audio: 'assets/audio/blue.mp3' },
    'Yellow+Purple': { name: 'Green', audio: 'assets/audio/green.mp3' },
    'Yellow+Red': { name: 'Orange', audio: 'assets/audio/orange.mp3' },
    'Yellow+Yellow': { name: 'Yellow', audio: 'assets/audio/yellow.mp3' },
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
