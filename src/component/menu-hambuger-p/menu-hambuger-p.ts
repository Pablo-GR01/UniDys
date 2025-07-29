import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-menu-hambuger-p',
  imports: [CommonModule,RouterLink,HttpClientModule],
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