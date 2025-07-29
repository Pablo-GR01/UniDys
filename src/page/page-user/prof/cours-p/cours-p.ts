import { Component } from '@angular/core';
import { HeaderP } from "../../../../component/header-p/header-p";
import { ApprentissageE } from "../../../../component-page/Eleve/page-cours/apprentissage-e/apprentissage-e";
import { FooterP } from "../../../../component/footer-p/footer-p";
import { NiveauP } from '../../../../component-page/Prof/page-cours/niveau-p/niveau-p';
import { Entete3P } from '../../../../component-page/Prof/page-apropos/entete3-p/entete3-p';

@Component({
  selector: 'app-cours-p',
  imports: [HeaderP, Entete3P, NiveauP, ApprentissageE, FooterP],
  templateUrl: './cours-p.html',
  styleUrl: './cours-p.css'
})
export class CoursP {

}
