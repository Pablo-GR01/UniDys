import { Component } from '@angular/core';
import { Header } from '../../public/component/header/header'
import { Section5 } from '../../page1E/section5/section5'
import { Section6 } from '../../page1E/section6/section6'

@Component({
  selector: 'app-cours',
  imports: [Header, Section5 , Section6 ],
  templateUrl: './cours.html',
  styleUrl: './cours.css'
})
export class Cours {

}
