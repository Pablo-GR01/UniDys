import { Component } from '@angular/core';
import { HeaderE } from '../../../../component/header-e/header-e';
import { EnteteE } from '../../../../component-page/Eleve/entete-e/entete-e';
import { AccompagnementE } from "../../../../component-page/Eleve/accompagnement-e/accompagnement-e";
import { RessourcesE } from '../../../../component-page/Eleve/ressources-e/ressources-e';
import { Section4E } from "../../../../component-page/Eleve/section4-e/section4-e";

@Component({
  selector: 'app-accueil-e',
  imports: [HeaderE, EnteteE, AccompagnementE, RessourcesE, Section4E],
  templateUrl: './accueil-e.html',
  styleUrl: './accueil-e.css'
})
export class AccueilE {

}
