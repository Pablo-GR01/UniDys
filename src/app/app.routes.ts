import { Routes } from '@angular/router';
import { Connexion } from '../page/connexion/connexion';
import { inscription } from '../page/inscription/inscription';
import { AccueilA } from '../page/page-user/admin/accueil-a/accueil-a';
import { AccueilP } from '../page/page-user/prof/accueil-p/accueil-p';
import { AccueilE } from '../page/page-user/eleve/accueil-e/accueil-e';
import { CoursE } from '../page/page-user/eleve/cours-e/cours-e';



export const routes: Routes = [
  { path: 'connexion', component: Connexion },
  { path: '', redirectTo: 'connexion', pathMatch: 'full' },
  { path: 'inscription', component: inscription },
  { path: 'accueilA', component: AccueilA},
  { path: 'accueilP', component: AccueilP},
  { path: 'accueilE', component: AccueilE},
  {path: 'coursE', component: CoursE}
];

