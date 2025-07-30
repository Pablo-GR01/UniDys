import { Routes } from '@angular/router';
import { Connexion } from '../page/connexion/connexion';
import { Inscription } from '../page/inscription/inscription';
import { AccueilA } from '../page/page-user/admin/accueil-a/accueil-a';
import { AccueilP } from '../page/page-user/prof/accueil-p/accueil-p';
import { AccueilE } from '../page/page-user/eleve/accueil-e/accueil-e';
import { CoursE } from '../page/page-user/eleve/cours-e/cours-e';
import { AproposE } from '../page/page-user/eleve/apropos-e/apropos-e';
import { MonEspaceE } from '../page/page-user/eleve/monespace-e/monespace-e';
import { AproposP } from '../page/page-user/prof/apropos-p/apropos-p';
import { CoursP } from '../page/page-user/prof/cours-p/cours-p';
import { MonespaceP } from '../page/page-user/prof/monespace-p/monespace-p';
import { ClasseCP } from '../page/page-user/eleve/classe-cp/classe-cp';


export const routes: Routes = [
  {path: 'connexion', component: Connexion },
  {path: '', redirectTo: 'connexion', pathMatch: 'full' },
  {path: 'inscription', component: Inscription },

  
  // route page admin
  {path: 'accueilA', component: AccueilA},



  // route page prof
  {path: 'accueilP', component: AccueilP},
  {path: 'aproposP', component: AproposP},
  {path: 'coursP', component: CoursP},
  {path: 'monespaceP', component: MonespaceP},


  // route page eleve
  {path: 'accueilE', component: AccueilE},
  {path: 'coursE', component: CoursE},
  {path: 'aproposE', component: AproposE},
  {path: 'monespaceE', component: MonEspaceE},
  {path: 'classCP', component: ClasseCP}
];

