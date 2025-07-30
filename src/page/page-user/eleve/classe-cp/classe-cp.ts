import { Component } from '@angular/core';
import { HeaderE } from "../../../../component/header-e/header-e";
import { EnteteE } from '../../../../component-page/Eleve/classe-CP/entete-e/entete-e';

@Component({
  selector: 'app-classe-cp',
  imports: [HeaderE,EnteteE],
  templateUrl: './classe-cp.html',
  styleUrl: './classe-cp.css'
})
export class ClasseCP {

}
