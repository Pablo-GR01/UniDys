import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { RouterLink } from '@angular/router';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-menu-hambuger-e',
  standalone: true,
  imports: [CommonModule, RouterLink, Icon],
  templateUrl: './menu-hambuger-e.html',
  styleUrls: ['./menu-hambuger-e.css']
})
export class MenuHamburgerE {
  menuOuvert = false;
  mobileMenu = false;
  constructor(public userService: UserService) { }

  toggleMenu() {
    this.menuOuvert = !this.menuOuvert;
    this.mobileMenu = false;
  }

  toggleMobileMenu() {
    this.mobileMenu = !this.mobileMenu;
    this.menuOuvert = false;
  }

}
