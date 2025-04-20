import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ColorService, Color } from '../services/color.service';

/**
 * ColorsComponent
 *
 * Presenta la galería de colores de la aplicación:
 * - Muestra cada color en una tarjeta con su nombre, imagen y acciones.
 * - Permite reproducir la pronunciación de cada color.
 * - Navegar al detalle completo de cada color.
 */
@Component({
  selector: 'app-colors',
  standalone: true,

  // Importaciones necesarias para usar directivas y componentes en la plantilla:
  // - RouterLink: para enlaces de navegación
  // - MatCardModule: tarjetas de Angular Material
  // - MatButtonModule: botones de Angular Material
  imports: [RouterLink, MatCardModule, MatButtonModule],

  templateUrl: './colors.component.html',
  styleUrls: ['./colors.component.scss'],
})
export class ColorsComponent {
  /**
   * colors
   * Signal (reactiva) que expone la lista de Color desde el servicio.
   * - Se define como el mismo tipo que colorService.colors para
   *   preservar la reactividad y detectar cambios automáticamente.
   */
  colors: typeof this.colorService.colors;

  /**
   * Constructor
   * @param colorService - Servicio inyectado que provee datos de los colores.
   *
   * Diseño de inyección:
   * - Se inyecta en el constructor para acceder al arreglo reactivo.
   * - Se asigna `this.colors` dentro del constructor para evitar
   *   inicializaciones de propiedades antes de la inyección.
   */
  constructor(private colorService: ColorService) {
    // Inicialización de la señal de colores tras inyección
    this.colors = this.colorService.colors;
  }

  /**
   * playAudio
   *
   * Reproduce la pronunciación de un color dado:
   * @param audioUrl - Ruta al archivo de audio (por ejemplo, 'assets/audio/red.mp3').
   *
   * Lógica:
   * - Crea un nuevo objeto Audio con la URL.
   * - Llama a play() para iniciar la reproducción.
   * - Esta implementación nativa es sencilla y compatible con navegadores.
   *
   * Decisión de diseño:
   * - No se usa librería adicional para audio, pues el uso de Audio nativo
   *   es suficiente para reproducir clips cortos.
   */
  playAudio(audioUrl: string) {
    const audio = new Audio(audioUrl);
    audio.play();
  }
}
