import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ColorService, Color } from '../services/color.service';

@Component({
  selector: 'app-colors',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule],
  templateUrl: './colors.component.html',
  styleUrls: ['./colors.component.scss'],
})
export class ColorsComponent {
  colors: typeof this.colorService.colors; // definir el tipo de "colors" (una signal)

  constructor(private colorService: ColorService) {
    // La asignación se realiza dentro del constructor, después de la inyección.
    this.colors = this.colorService.colors;
  }

  playAudio(audioUrl: string) {
    const audio = new Audio(audioUrl);
    audio.play();
  }
}
