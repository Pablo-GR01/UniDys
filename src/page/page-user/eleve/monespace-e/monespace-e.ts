import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../services/user.service';
import { Entete5E } from '../../../../component-page/Eleve/page-monespace/entete5-e/entete5-e';
import { HeaderE } from '../../../../component/header-e/header-e';
import { MesCoursE } from "../../../../component-page/Eleve/page-monespace/mes-cours-e/mes-cours-e";
import { Section5E } from '../../../../component-page/Eleve/page-monespace/section5-e/section5-e';

@Component({
  selector: 'app-monespace-e',
  imports: [CommonModule, Entete5E, HeaderE, Section5E, MesCoursE, MesCoursE],
  templateUrl: './monespace-e.html',
  styleUrls: ['./monespace-e.css']
})
export class MonEspaceE {
  constructor(public userService: UserService) {}

  // Optionnel : méthode pour déconnexion
  logout() {
    this.userService.clearUser();
  }
}
