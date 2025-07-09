import { Component } from '@angular/core';
import { Header } from "../../public/component/header/header";
import { Section8 } from '../../page1E/section8/section8'
import { Section9 } from '../../page1E/section9/section9'
import { Section10 } from '../../page1E/section10/section10';
import { Section11 } from '../../page1E/section11/section11';
import { Footer } from '../../public/component/footer/footer'


@Component({
  selector: 'app-apropos',
  imports: [Header, Section8, Section9, Section10, Section11, Footer],
  templateUrl: './apropos.html',
  styleUrl: './apropos.css'
})
export class Apropos {

}
