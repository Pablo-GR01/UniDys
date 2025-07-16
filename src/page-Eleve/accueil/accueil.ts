import { Component } from '@angular/core';
import { Header } from '../../../public/component/header/header'
import { Section1 } from '../../component-eleve/section1/section1'
import { Section2 } from '../../component-eleve/section2/section2'
import { Footer } from '../../../public/component/footer/footer'
import { Section3 } from '../../component-eleve/section3/section3';
import { Section4 } from '../../component-eleve/section4/section4';
import { Contact } from '../../../public/component/contact/contact';
@Component({
  selector: 'app-accueil',
  imports: [Header , Section1 , Footer , Section2 , Section3 , Section4 , Contact],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css'
})
export class AccueilE{

}
