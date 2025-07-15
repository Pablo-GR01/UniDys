import { Component } from '@angular/core';
import { Header } from "../../../public/component/header/header";
import { Section8 } from '../../component-eleve/section8/section8'
import { Section9 } from '../../component-eleve/section9/section9'
import { Section10 } from '../../component-eleve/section10/section10';
import { Section11 } from '../../component-eleve/section11/section11';
import { Footer } from '../../../public/component/footer/footer'


@Component({
  selector: 'app-apropos',
  imports: [Header, Section8, Section9, Section10, Section11, Footer],
  templateUrl: './apropos.html',
  styleUrl: './apropos.css'
})
export class Apropos {

}
