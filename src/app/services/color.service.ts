import { Injectable, signal } from '@angular/core';

export interface Color {
  id: number;
  name: string;
  english: string;
  image: string;
  audio: string;
  description?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ColorService {
  // Creamos una signal privada que almacena el arreglo de colores
  private _colors = signal<Color[]>([
    {
      id: 1,
      name: 'Rojo',
      english: 'Red',
      image: 'assets/images/red.png',
      audio: 'assets/audio/red.mp3',
      description: 'El rojo es un color apasionado y vibrante.',
    },
    {
      id: 2,
      name: 'Verde',
      english: 'Green',
      image: 'assets/images/green.png',
      audio: 'assets/audio/green.mp3',
      description: 'El verde representa la naturaleza y la tranquilidad.',
    },
    {
      id: 3,
      name: 'Azul',
      english: 'Blue',
      image: 'assets/images/blue.png',
      audio: 'assets/audio/blue.mp3',
      description: 'El azul es un color calmante y refrescante.',
    },
    // Agrega más colores conforme los necesites…
  ]);

  // Método getter que retorna la signal de colores (lectura reactiva)
  get colors() {
    return this._colors;
  }

  // Método para obtener un color por su id
  getColorById(id: number): Color | undefined {
    return this._colors().find((color) => color.id === id);
  }
}
