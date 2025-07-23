import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderE } from "../../../../component/header-e/header-e";
import { Entete2E } from '../../../../component-page/Eleve/entete2-e/entete2-e';
import { NiveauE } from '../../../../component-page/Eleve/niveau-e/niveau-e';
import { ApprentissageE } from '../../../../component-page/Eleve/apprentissage-e/apprentissage-e';
import { FooterE } from "../../../../component/footer-e/footer-e";

@Component({
  selector: 'app-cours-e',
  imports: [HeaderE, Entete2E, NiveauE, ApprentissageE, FooterE],
  templateUrl: './cours-e.html',
  styleUrl: './cours-e.css'
})
export class CoursE {

}
