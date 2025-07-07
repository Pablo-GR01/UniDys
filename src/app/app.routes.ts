import { Routes } from '@angular/router';
import { connexion } from '../../page/connexion/connexion';
import { inscription } from '../../page/inscription/inscription';
import { accueil } from '../../page/accueil/accueil';
export const routes: Routes = [
  { path: 'connexion', component: connexion },
  { path: '', redirectTo: 'connexion', pathMatch: 'full' },
  { path: 'inscription', component: inscription },
  { path: 'accueil', component: accueil}
];

  
