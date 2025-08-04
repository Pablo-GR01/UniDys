import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-menu-hambuger-p',
  imports: [CommonModule,RouterLink,HttpClientModule,Icon],
  templateUrl: './menu-hambuger-p.html',
  styleUrl: './menu-hambuger-p.css'
})
export class MenuHamburgerP {
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
