import { Component } from '@angular/core';
import { HeaderP } from "../../../../component/header-p/header-p";
import { RouterLink } from '@angular/router';

import { FooterP } from "../../../../component/footer-p/footer-p";
import { Entete2P } from '../../../../component-page/Prof/page-cours/entete2-p/entete2-p';
import { EngagementP } from '../../../../component-page/Prof/page-apropos/engagement-p/engagement-p';
import { Section5P } from '../../../../component-page/Prof/page-monespace/section5-p/section5-p';

@Component({
  selector: 'app-apropos-p',
  imports: [HeaderP, Entete2P, EngagementP, Section5P, FooterP],
  templateUrl: './apropos-p.html',
  styleUrl: './apropos-p.css'
})
export class AproposP {

}
