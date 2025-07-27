import { Component } from '@angular/core';
import { HeaderP } from "../../../../component/header-p/header-p";
import { Entete4P } from '../../../../component-page/Prof/entete4-p/entete4-p';
import { Section6E } from '../../../../component-page/Prof/section6-p/section6-p';
import { Section7P } from '../../../../component-page/Prof/section7-p/section7-p';
import { MescoursP } from "../../../../component-page/Prof/mescours-p/mescours-p";

@Component({
  selector: 'app-monespace-p',
  imports: [HeaderP, Entete4P, Section6E, Section7P, MescoursP],
  templateUrl: './monespace-p.html',
  styleUrl: './monespace-p.css'
})
export class MonespaceP {

}
