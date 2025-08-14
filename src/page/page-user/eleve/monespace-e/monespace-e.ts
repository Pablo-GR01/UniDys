import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../services/user.service';
import { Entete5E } from '../../../../component-page/Eleve/page-monespace/entete5-e/entete5-e';
import { HeaderE } from '../../../../component/header-e/header-e';
import { Section5E } from '../../../../component-page/Eleve/page-monespace/section5-e/section5-e';
import { LevelE } from '../../../../component-page/Eleve/page-monespace/level-e/level-e';
import { ContactE } from "../../../../component/contact-e/contact-e";
import { FooterE } from "../../../../component/footer-e/footer-e";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DerniersQCM } from '../../../../component-page/Eleve/page-monespace/dernier-qcm/dernier-qcm';




@Component({
  selector: 'app-monespace-e',
  imports: [CommonModule, Entete5E, HeaderE, Section5E, LevelE, ContactE, FooterE, DerniersQCM , HttpClientModule],
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
