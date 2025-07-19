import { Routes } from '@angular/router';
import { connexion } from '../page-Eleve/connexion/connexion';
import { inscription } from '../page-Eleve/inscription/inscription';
import { AccueilE } from '../page-Eleve/accueil/accueil';
import { Cours } from '../page-Eleve/cours/cours'
import { Apropos } from '../page-Eleve/apropos/apropos'
import { Monespace } from '../page-Eleve/monespace/monespace'
import { AccueilP } from '../page-Prof/accueil-p/accueil';
import { MonespaceP } from '../page-Prof/monespace-p/monespace-p';
import { CoursP } from '../page-Prof/cours-p/cours-p';



export const routes: Routes = [
  { path: 'connexion', component: connexion },
  { path: '', redirectTo: 'connexion', pathMatch: 'full' },
  { path: 'inscription', component: inscription },
  { path: 'accueilE', component: AccueilE},
  { path: 'cours', component: Cours},
  { path: 'apropos', component: Apropos},
  { path: 'monespace', component: Monespace},
  // Route vers les page coté prof
  {path: 'accueilP', component: AccueilP},
  {path: 'monespaceP', component: MonespaceP},
  {path: 'coursP', component: CoursP}
];

