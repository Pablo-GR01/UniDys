import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu-hambuger-a',
  standalone: true,            // Il manque ça, sinon Angular ne sait pas que c’est un standalone
  imports: [CommonModule, RouterLink],
  templateUrl: './menu-hambuger-a.html',
  styleUrls: ['./menu-hambuger-a.css'], // il faut écrire styleUrls (au pluriel)
})
export class MenuHambugerA {
  menuOuvert = false;

  constructor(public userService: UserService) {}

  toggleMenu() {
    this.menuOuvert = !this.menuOuvert;
  }
}
