import { Component } from '@angular/core';
import { Header } from '../../../public/component/header/header'
import { Section5 } from '../../component-eleve/section5/section5'
import { Section6 } from '../../component-eleve/section6/section6'
import { Section7 } from '../../component-eleve/section7/section7'
import { Footer } from "../../../public/component/footer/footer";

@Component({
  selector: 'app-cours',
  imports: [Header, Section5, Section6, Section7, Footer],
  templateUrl: './cours.html',
  styleUrl: './cours.css'
})
export class Cours {

}
