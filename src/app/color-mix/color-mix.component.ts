import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ColorService, Color } from '../services/color.service';

@Component({
  selector: 'app-color-mix',
  standalone: true,
  imports: [
    CommonModule, // ngIf, ngFor...
    MatCardModule, // <mat-card>
    MatSelectModule, // <mat-select>
    MatButtonModule, // <button mat-raised-button>
  ],
  templateUrl: './color-mix.component.html',
  styleUrls: ['./color-mix.component.scss'],
})
export class ColorMixComponent implements OnInit {
  // Señal con la lista de colores disponibles desde el servicio
  colors = signal<Color[]>([]);
  // Señales para los dos picks
  pickA = signal<Color | undefined>(undefined);
  pickB = signal<Color | undefined>(undefined);
  // Señal con el hex resultante de la mezcla
  mixedHex = signal<string>('#ffffff');

  constructor(private colorService: ColorService) {}

  ngOnInit() {
    // Cargamos el arreglo de colores al iniciar
    this.colors.set(this.colorService.colors());
  }

  /**
   * parseHex
   * Convierte un código hex (#rrggbb) en objeto {r,g,b}
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
   * Convierte valores r,g,b (0–255) de vuelta a string hex "#rrggbb"
   */
  private toHex(rgb: { r: number; g: number; b: number }) {
    const to2 = (v: number) => v.toString(16).padStart(2, '0');
    return `#${to2(rgb.r)}${to2(rgb.g)}${to2(rgb.b)}`;
  }

  /**
   * mixColors
   * Toma los dos picks, extrae su hex, los parsea a RGB, promedia cada canal
   * y fija la señal mixedHex para mostrar el resultado.
   */
  mixColors() {
    const a = this.pickA();
    const b = this.pickB();
    if (!a || !b) {
      return;
    }
    // Obtenemos los hex de cada color usando el mismo mapeo de getOptionColor()
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
  }
}
