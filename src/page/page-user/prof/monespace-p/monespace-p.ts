import { Component } from '@angular/core';
import { HeaderP } from "../../../../component/header-p/header-p";

import { Section7P } from '../../../../component-page/Prof/page-monespace/section7-p/section7-p';
import { MescoursP } from "../../../../component-page/Prof/page-monespace/mescours-p/mescours-p";
import { Section6P } from '../../../../component-page/Prof/page-monespace/section6-p/section6-p';
import { Entete4P } from '../../../../component-page/Prof/page-apropos/entete4-p/entete4-p';
import { Entete5P } from '../../../../component-page/Prof/page-monespace/entete5-p/entete5-p';

@Component({
  selector: 'app-monespace-p',
  standalone: true,
  imports: [HeaderP, Entete5P, Section6P, Section7P, MescoursP],
  templateUrl: './monespace-p.html',
  styleUrl: './monespace-p.css'
})
export class MonespaceP {

}
