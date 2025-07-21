import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-menu-hambuger-e',
  standalone: true,
  imports: [CommonModule],
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
