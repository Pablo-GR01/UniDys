import { Component } from '@angular/core';
import { HeaderP } from "../../../../component/header-p/header-p";
import { RouterLink } from '@angular/router';
import { Entete2E } from "../../../../component-page/Prof/entete2-p/entete2-p";
import { EngagementE } from '../../../../component-page/Eleve/engagement-e/engagement-e';
import { Section5P } from "../../../../component-page/Prof/section5-p/section5-p";
import { FooterP } from "../../../../component/footer-p/footer-p";

@Component({
  selector: 'app-apropos-p',
  imports: [HeaderP, Entete2E, EngagementE, Section5P, FooterP],
  templateUrl: './apropos-p.html',
  styleUrl: './apropos-p.css'
})
export class AproposP {

}
