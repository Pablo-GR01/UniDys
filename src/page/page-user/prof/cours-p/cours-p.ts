import { Component } from '@angular/core';
import { HeaderP } from "../../../../component/header-p/header-p";
import { Entete3E } from "../../../../component-page/Prof/entete3-p/entete3-p";
import { NiveauE } from "../../../../component-page/Prof/niveau-p/niveau-p";
import { ApprentissageE } from "../../../../component-page/Eleve/apprentissage-e/apprentissage-e";
import { FooterP } from "../../../../component/footer-p/footer-p";

@Component({
  selector: 'app-cours-p',
  imports: [HeaderP, Entete3E, NiveauE, ApprentissageE, FooterP],
  templateUrl: './cours-p.html',
  styleUrl: './cours-p.css'
})
export class CoursP {

}
