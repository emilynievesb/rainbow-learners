import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ColorService, Color } from '../services/color.service';
import { MatCard, MatCardActions } from '@angular/material/card';

/**
 * ColorDetailComponent
 *
 * Presenta los detalles de un color seleccionado:
 * - Muestra el nombre, la imagen y la descripción del color.
 * - Permite reproducir el audio con la pronunciación del color.
 * - Ofrece navegación de regreso a la galería de colores.
 */
@Component({
  selector: 'app-color-detail',
  standalone: true,
  imports: [
    CommonModule, // Módulo con directivas comunes (ngIf, ngFor, etc.)
    RouterLink, // Soporte para navegar con [routerLink]
    MatCard, // Componente de Angular Material para tarjetas
    MatCardActions, // Subcomponente para acciones dentro de la tarjeta
  ],
  templateUrl: './color-detail.component.html',
  styleUrls: ['./color-detail.component.scss'],
})
export class ColorDetailComponent implements OnInit {
  /**
   * Señal reactiva que almacena el Color seleccionado.
   * - Tipo: Color | undefined (puede no estar definido inicialmente).
   * - Se actualiza en ngOnInit tras leer el parámetro de ruta.
   */
  color = signal<Color | undefined>(undefined);

  /**
   * Constructor
   * @param route - Servicio para acceder a parámetros de la ruta activa.
   * @param colorService - Servicio que provee la lista de colores y métodos de consulta.
   */
  constructor(
    private route: ActivatedRoute,
    private colorService: ColorService
  ) {}

  /**
   * ngOnInit
   *
   * Ciclo de vida Angular que se ejecuta al inicializar el componente.
   * Lógica:
   * 1. Lee el parámetro 'id' desde la URL (ruta).
   * 2. Convierte el parámetro a número.
   * 3. Llama a colorService.getColorById(id) para obtener el objeto Color.
   * 4. Si se encuentra, actualiza la señal 'color' para disparar la vista reactiva.
   */
  ngOnInit() {
    // 1. Obtener el parámetro 'id' de la ruta
    const idParam = this.route.snapshot.paramMap.get('id');
    // 2. Convertir a número, o null si no existe
    const id = idParam ? parseInt(idParam, 10) : null;

    if (id !== null) {
      // 3. Buscar el color correspondiente en el servicio
      const foundColor = this.colorService.getColorById(id);
      if (foundColor) {
        // 4. Actualizar la señal para que la vista reflecte el cambio
        this.color.set(foundColor);
      }
    }
  }

  /**
   * playAudio
   *
   * Reproduce un archivo de audio dado su URL.
   * @param audioUrl - Ruta al recurso de audio (por ejemplo, 'assets/audio/red.mp3').
   *
   * Diseño:
   * - Se crea un nuevo objeto Audio con la URL.
   * - Se llama a play() para iniciar la reproducción.
   * - Decidimos usar esta API nativa por simplicidad y compatibilidad.
   */
  playAudio(audioUrl: string) {
    const audio = new Audio(audioUrl);
    audio.play();
  }
}
