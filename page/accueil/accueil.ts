import { Component } from '@angular/core';
import { Header } from '../../public/component/header/header'
import { Section1 } from '../../public/component/section1/section1'
import { Section2 } from '../../public/component/section2/section2'
import { Footer } from '../../public/component/footer/footer'
import { Section3 } from '../../public/component/section3/section3';
import { Section4 } from '../../public/component/section4/section4';
import { Contact } from '../../public/component/contact/contact';
@Component({
  selector: 'app-accueil',
  imports: [Header, Section1, Footer, Section2,Section3, Section4, Contact],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css'
})
export class accueil{

}
