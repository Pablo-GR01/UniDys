import { Component } from '@angular/core';
import { HeaderE } from "../../../../component/header-e/header-e";
import { Entete3E } from "../../../../component-page/Eleve/entete3-e/entete3-e";
import { EngagementE } from "../../../../component-page/Eleve/engagement-e/engagement-e";
import { Entete4E } from "../../../../component-page/Eleve/entete4-e/entete4-e";
import { FooterE } from "../../../../component/footer-e/footer-e";
//
@Component({
  selector: 'app-apropos-e',
  imports: [HeaderE, Entete3E, EngagementE, Entete4E, FooterE],
  templateUrl: './apropos-e.html',
  styleUrl: './apropos-e.css'
})
export class AproposE {

}
