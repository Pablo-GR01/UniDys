import { Component } from '@angular/core';
import { Header } from "../../public/component/header/header";
import { Section12 } from '../../page1E/section12/section12'
import { Section13 } from '../../page1E/section13/section13'

@Component({
  selector: 'app-monespace',
  imports: [Header, Section12, Section13],
  templateUrl: './monespace.html',
  styleUrl: './monespace.css'
})
export class Monespace {

}
