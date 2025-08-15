import { Component } from '@angular/core';
import { HeaderE } from "../../../../component/header-e/header-e";
import { Entete3E } from "../../../../component-page/Eleve/page-apropos/entete3-e/entete3-e";
import { EngagementE } from "../../../../component-page/Eleve/page-apropos/engagement-e/engagement-e";
import { Entete4E } from "../../../../component-page/Eleve/page-apropos/entete4-e/entete4-e";
import { FooterE } from "../../../../component/footer-e/footer-e";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AvisE } from "../../../../component/avis/avis";



@Component({
  selector: 'app-apropos-e',
  imports: [HeaderE, Entete3E, EngagementE, Entete4E, FooterE, HttpClientModule, CommonModule, AvisE],
  templateUrl: './apropos-e.html',
  styleUrl: './apropos-e.css',
})
export class AproposE {

}
