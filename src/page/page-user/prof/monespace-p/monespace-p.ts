import { Component } from '@angular/core';
import { HeaderP } from "../../../../component/header-p/header-p";

import { MescoursP } from "../../../../component-page/Prof/page-monespace/mescours-p/mescours-p";
import { Entete5P } from '../../../../component-page/Prof/page-monespace/entete5-p/entete5-p';
import { Section5P } from '../../../../component-page/Prof/page-monespace/section5-p/section5-p';

@Component({
  selector: 'app-monespace-p',
  standalone: true,
  imports: [HeaderP, Entete5P, Section5P, MescoursP],
  templateUrl: './monespace-p.html',
  styleUrl: './monespace-p.css'
})
export class MonespaceP {

}
