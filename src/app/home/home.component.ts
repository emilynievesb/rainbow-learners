import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

/**
 * HomeComponent
 *
 * Componente de bienvenida ("landing page") de la aplicación Rainbow Learners.
 * - Propósito: Mostrar una sección principal con información estática sobre la plataforma,
 *   explicando su objetivo, beneficios y proporcionando botones de navegación hacia
 *   las funcionalidades principales (galería de colores y juego).
 * - Diseño: Se apoya en Angular Material (MatCard) y RouterLink para una interfaz
 *   moderna y navegación declarativa.
 */
@Component({
  selector: 'app-home',

  // Indica que este componente es standalone (sin NgModule).
  standalone: true,

  // Importaciones necesarias para la plantilla:
  // - RouterLink: directiva para enlaces de navegación ([routerLink]).
  // - MatCardModule: módulo de Angular Material que provee <mat-card> para estructurar contenido.
  imports: [RouterLink, MatCardModule],

  // Enlaces a los archivos de plantilla y estilos
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  // Clase vacía: este componente no define lógica propia en TypeScript,
  // ya que todo el contenido es estático y se maneja en la plantilla HTML.
  //
  // Cualquier interacción o navegación se realiza directamente con RouterLink
  // y las señales de Angular Material en la plantilla.
}
