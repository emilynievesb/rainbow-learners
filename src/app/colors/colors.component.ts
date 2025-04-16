import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Color {
  id: number;
  name: string;
  english: string;
  image: string;
  audio: string;
}

@Component({
  selector: 'app-colors',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './colors.component.html',
  styleUrl: './colors.component.scss',
})
export class ColorsComponent {
  // Almacenamos la lista de colores en una signal para hacerlo reactivo
  colors = signal<Color[]>([
    {
      id: 1,
      name: 'Rojo',
      english: 'Red',
      image: 'assets/images/red.jpg',
      audio: 'assets/audio/red.mp3',
    },
    {
      id: 2,
      name: 'Verde',
      english: 'Green',
      image: 'assets/images/green.jpg',
      audio: 'assets/audio/green.mp3',
    },
    {
      id: 3,
      name: 'Azul',
      english: 'Blue',
      image: 'assets/images/blue.jpg',
      audio: 'assets/audio/blue.mp3',
    },
    // Agrega más colores según sea necesario
  ]);

  playAudio(audioUrl: string) {
    const audio = new Audio(audioUrl);
    audio.play();
  }
}
