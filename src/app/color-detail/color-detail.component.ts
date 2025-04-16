import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ColorService, Color } from '../services/color.service';
import { MatCard, MatCardActions } from '@angular/material/card';

@Component({
  selector: 'app-color-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardActions, MatCard],
  templateUrl: './color-detail.component.html',
  styleUrls: ['./color-detail.component.scss'],
})
export class ColorDetailComponent implements OnInit {
  // Signal para almacenar el color seleccionado
  color = signal<Color | undefined>(undefined);

  constructor(
    private route: ActivatedRoute,
    private colorService: ColorService
  ) {}

  ngOnInit() {
    // Recuperamos el parámetro "id" de la ruta y buscamos el color en el servicio
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? parseInt(idParam, 10) : null;
    if (id !== null) {
      const foundColor = this.colorService.getColorById(id);
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
