import { Routes } from '@angular/router';
import { connexion } from '../../page/connexion/connexion';
import { inscription } from '../../page/inscription/inscription';
import { accueil } from '../../page/accueil/accueil';
import { Cours } from '../../page/cours/cours'




export const routes: Routes = [
  { path: 'connexion', component: connexion },
  { path: '', redirectTo: 'connexion', pathMatch: 'full' },
  { path: 'inscription', component: inscription },
  { path: 'accueil', component: accueil},
  { path: 'cours', component: Cours}
];

  
