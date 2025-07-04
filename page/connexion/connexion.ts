import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
//import { Logo } from "../logo/logo";

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [CommonModule,RouterModule],  // Pour ngIf, ngFor etc.
  templateUrl: './connexion.html',
  styleUrls: ['./connexion.css']
})
export class connexion {}
