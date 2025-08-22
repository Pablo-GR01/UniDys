import { Component } from '@angular/core';
import { ProfileService } from '../../services/userService/Profile.Service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-menu-hambuger-a',
  standalone: true,            // Il manque ça, sinon Angular ne sait pas que c’est un standalone
  imports: [CommonModule, RouterLink,Icon],
  templateUrl: './menu-hambuger-a.html',
  styleUrls: ['./menu-hambuger-a.css'], // il faut écrire styleUrls (au pluriel)
})
export class MenuHambugerA {
  menuOuvert = false;
  mobileMenu = false;
  constructor(public userprofil: ProfileService) { }

  toggleMenu() {
    this.menuOuvert = !this.menuOuvert;
    this.mobileMenu = false;
  }

  toggleMobileMenu() {
    this.mobileMenu = !this.mobileMenu;
    this.menuOuvert = false;
  }

}
