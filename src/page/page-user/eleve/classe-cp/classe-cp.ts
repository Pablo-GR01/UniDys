import { Component } from '@angular/core';
import { HeaderE } from "../../../../component/header-e/header-e";
import { EnteteE } from '../../../../component-page/Eleve/classe-CP/entete-e/entete-e';
import { CPCOURSE } from "../../../../component-page/Eleve/classe-CP/cpcourse/cpcourse";
import { ContactE } from "../../../../component/contact-e/contact-e";
import { FooterE } from "../../../../component/footer-e/footer-e";


@Component({
  selector: 'app-classe-cp',
  imports: [HeaderE, EnteteE, CPCOURSE, ContactE, FooterE],
  templateUrl: './classe-cp.html',
  styleUrl: './classe-cp.css'
})
export class ClasseCP {

}
