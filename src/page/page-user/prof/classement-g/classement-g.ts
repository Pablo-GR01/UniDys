import { Component } from '@angular/core';
import { HeaderP } from "../../../../component/header-p/header-p";
import { Tableau } from "../../../../component-page/Eleve/page-classement/tableau/tableau";

@Component({
  selector: 'app-classement-g',
  imports: [HeaderP, Tableau],
  templateUrl: './classement-g.html',
  styleUrl: './classement-g.css'
})
export class ClassementG {

}
