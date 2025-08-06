import { Component } from '@angular/core';
import { HeaderE } from "../../../../component/header-e/header-e";
import { EnteteE } from '../../../../component-page/Eleve/classe-CP/entete-e/entete-e';
import { CPCOURSE } from "../../../../component-page/Eleve/classe-CP/cpcourse/cpcourse";


@Component({
  selector: 'app-classe-cp',
  imports: [HeaderE, EnteteE, CPCOURSE],
  templateUrl: './classe-cp.html',
  styleUrl: './classe-cp.css'
})
export class ClasseCP {

}
