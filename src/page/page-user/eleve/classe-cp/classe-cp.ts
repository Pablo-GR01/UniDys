import { Component } from '@angular/core';
import { HeaderE } from "../../../../component/header-e/header-e";
import { EnteteE } from '../../../../component-page/Eleve/classe-CP/entete-e/entete-e';
import { CPCours } from "../../../../component-page/Eleve/classe-CP/cpcours/cpcours";

@Component({
  selector: 'app-classe-cp',
  imports: [HeaderE, EnteteE, CPCours],
  templateUrl: './classe-cp.html',
  styleUrl: './classe-cp.css'
})
export class ClasseCP {

}
