import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ColorsComponent } from './colors/colors.component';
import { ColorDetailComponent } from './color-detail/color-detail.component';
import { GameComponent } from './game/game.component';
import { ColorMixComponent } from './color-mix/color-mix.component';

/**
 * routes
 *
 * Array de rutas para la aplicación Rainbow Learners.
 * - Utiliza el sistema de enrutamiento de Angular para mapear URL a componentes.
 * - Cada objeto Route define:
 *    • path: segmento de URL que activa la ruta.
 *    • component: componente standalone que se renderiza.
 *    • redirectTo/pathMatch: comportamiento para rutas no definidas.
 */
export const routes: Routes = [
  {
    // Ruta raíz: muestra la pantalla de bienvenida (HomeComponent)
    path: '',
    component: HomeComponent,
  },
  {
    // Ruta de galería de colores: lista todos los colores disponibles
    path: 'colors',
    component: ColorsComponent,
  },
  {
    // Ruta de detalle de color: recibe un parámetro dinámico `id`
    // - Ejemplo: /colors/2 renderizará ColorDetailComponent para el color con id=2
    path: 'colors/:id',
    component: ColorDetailComponent,
  },
  {
    // Ruta del juego interactivo
    // Permite acceder al componente GameComponent para adivinar colores
    path: 'game',
    component: GameComponent,
  },
  { path: 'mix', component: ColorMixComponent },

  {
    // Ruta comodín:
    // - path '**' captura cualquier URL no definida arriba.
    // - redirectTo '' redirige a la ruta raíz.
    // - pathMatch 'full' asegura coincidencia completa de la URL.
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
