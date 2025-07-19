import { Component } from '@angular/core';
import { Header2 } from "../../../public/component/header2/header2";
import { Section1 } from "../../component-prof/section1/section1";
import { Section2 } from '../../component-eleve/section2/section2';
import { Section3 } from '../../component-eleve/section3/section3';
import { Section2P } from '../../component-prof/section2/section2';
import { Contact } from '../../../public/component/contact/contact';
import { Footer } from '../../../public/component/footer/footer';

@Component({
  selector: 'app-accueil',
  imports: [Header2, Section1, Section2, Section3, Section2P, Contact, Footer],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css'
})
export class AccueilP{

}
