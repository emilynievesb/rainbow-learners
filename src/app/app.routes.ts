import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ColorsComponent } from './colors/colors.component';
import { ColorDetailComponent } from './color-detail/color-detail.component';
import { GameComponent } from './game/game.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'colors', component: ColorsComponent },
  { path: 'colors/:id', component: ColorDetailComponent },
  { path: 'game', component: GameComponent },
  // Ruta comodín para redirigir a la página de inicio si la ruta no existe
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
