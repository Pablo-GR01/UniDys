import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu-hambuger-p',
  imports: [  CommonModule],
  templateUrl: './menu-hambuger-p.html',
  styleUrl: './menu-hambuger-p.css'
})
export class MenuHambugerP {
  menuOuvert = false;

  constructor(public userService: UserService) {}

  toggleMenu() {
    this.menuOuvert = !this.menuOuvert;
  }
}