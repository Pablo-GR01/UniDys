import { Component } from '@angular/core';
import { HeaderE } from '../../../../component/header-e/header-e';
import { HeaderP } from '../../../../component/header-p/header-p'; // 🔹 header prof
import { Tableau } from "../../../../component-page/Eleve/page-classement/tableau/tableau";

@Component({
  selector: 'app-classement-g',
  standalone: true,
  imports: [HeaderE, HeaderP, Tableau],
  templateUrl: './classement-g.html',
  styleUrls: ['./classement-g.css']
})
export class ClassementGE {
  // 👉 Ici tu récupères le rôle de l’utilisateur connecté
  role: string = ''; 

  constructor() {
    // Exemple : rôle stocké dans le localStorage après connexion
    this.role = localStorage.getItem('role') || '';
  }
}
