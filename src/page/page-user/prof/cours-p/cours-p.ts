import { Component } from '@angular/core';
import { HeaderP } from "../../../../component/header-p/header-p";
import { ApprentissageE } from "../../../../component-page/Eleve/classe-CP/apprentissage-e/apprentissage-e";
import { FooterP } from "../../../../component/footer-p/footer-p";
import { NiveauP } from '../../../../component-page/Prof/page-cours/niveau-p/niveau-p';

import { Entete2P } from '../../../../component-page/Prof/page-cours/entete2-p/entete2-p';

@Component({
  selector: 'app-cours-p',
  imports: [HeaderP, Entete2P, NiveauP, ApprentissageE, FooterP],
  templateUrl: './cours-p.html',
  styleUrl: './cours-p.css'
})
export class CoursP {

}
