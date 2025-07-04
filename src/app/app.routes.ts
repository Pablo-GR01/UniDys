import { Routes } from '@angular/router';
import { connexion } from '../../page/connexion/connexion';
// import { Accueil } from './accueil/accueil';
// import { Inscription } from './inscription/inscription';

export const routes: Routes = [
  { path: '', component: connexion },
//   { path: 'accueil', component: Accueil },
//   { path: 'connexion', redirectTo: '', pathMatch: 'full' },  // redirection automatique
//   { path: 'inscription', component: Inscription }
];
