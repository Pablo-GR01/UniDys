import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu-hamburger',
  templateUrl: './menu-hamburger.html',
  styleUrls: ['./menu-hamburger.css'],
  standalone: true,
  imports: [RouterModule, CommonModule]
})
export class HamburgerMenu {
  isOpen = false;
  timeoutId: any;

  toggleMenu() {
    if (!this.isOpen) {
      this.isOpen = true;
      this.timeoutId = setTimeout(() => {
        this.isOpen = false;
      }, 5000);
    } else {
      this.isOpen = false;
      clearTimeout(this.timeoutId);
    }
  }
}
