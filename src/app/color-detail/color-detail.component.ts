import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ColorService, Color } from '../services/color.service';

@Component({
  selector: 'app-color-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './color-detail.component.html',
  styleUrls: ['./color-detail.component.scss'],
})
export class ColorDetailComponent implements OnInit {
  // Creamos una signal para almacenar el color seleccionado
  color = signal<Color | undefined>(undefined);

  constructor(
    private route: ActivatedRoute,
    private colorService: ColorService // Inyectamos el servicio
  ) {}

  ngOnInit() {
    // Obtenemos el parámetro 'id' de la URL
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? parseInt(idParam, 10) : null;
    if (id !== null) {
      // Utilizamos el método del servicio para buscar el color
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
