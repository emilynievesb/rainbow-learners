import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Color {
  id: number;
  name: string;
  english: string;
  image: string;
  audio: string;
  description?: string;
}

@Component({
  selector: 'app-color-detail',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './color-detail.component.html',
  styleUrl: './color-detail.component.scss',
})
export class ColorDetailComponent implements OnInit {
  color = signal<Color | undefined>(undefined);
  // Lista simulada; en producción se debería usar un servicio compartido
  colors: Color[] = [
    {
      id: 1,
      name: 'Rojo',
      english: 'Red',
      image: 'assets/images/red.jpg',
      audio: 'assets/audio/red.mp3',
      description: 'El rojo es un color apasionado y vibrante.',
    },
    {
      id: 2,
      name: 'Verde',
      english: 'Green',
      image: 'assets/images/green.jpg',
      audio: 'assets/audio/green.mp3',
      description: 'El verde representa la naturaleza y la tranquilidad.',
    },
    {
      id: 3,
      name: 'Azul',
      english: 'Blue',
      image: 'assets/images/blue.jpg',
      audio: 'assets/audio/blue.mp3',
      description: 'El azul es un color calmante y refrescante.',
    },
  ];
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? parseInt(idParam, 10) : null;
    if (id !== null) {
      const foundColor = this.colors.find((c) => c.id === id);
      if (foundColor) {
        this.color.set(foundColor);
      }
    }
  }

  playAudio(audioUrl: string) {
    const audio = new Audio(audioUrl);
    audio.play();
  }
}
