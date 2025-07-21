import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-menu-hambuger-a',
  imports: [CommonModule],
  templateUrl: './menu-hambuger-a.html',
  styleUrl: './menu-hambuger-a.css'
})
export class MenuHambugerA {
  menuOuvert = false;

  constructor(public userService: UserService) {}

  toggleMenu() {
    this.menuOuvert = !this.menuOuvert;
  }
}