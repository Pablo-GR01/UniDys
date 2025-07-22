import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu-hambuger-e',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './menu-hambuger-e.html',
  styleUrls: ['./menu-hambuger-e.css']
})
export class MenuHamburgerE {
  menuOuvert = false;

  constructor(public userService: UserService) {}

  toggleMenu() {
    this.menuOuvert = !this.menuOuvert;
  }
}
