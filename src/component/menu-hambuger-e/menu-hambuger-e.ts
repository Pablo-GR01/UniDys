import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProfileService } from '../../services/userService/Profile.Service';
import { Router, RouterLink } from '@angular/router';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-menu-hambuger-e',
  standalone: true,
  imports: [CommonModule, Icon,RouterLink],
  templateUrl: './menu-hambuger-e.html',
  styleUrls: ['./menu-hambuger-e.css']
})
export class MenuHamburgerE {
  menuOuvert = false;
  mobileMenu = false;

  constructor(
    public userprofil: ProfileService,
    private router: Router
  ) {}

  toggleMenu() {
    this.menuOuvert = !this.menuOuvert;
    this.mobileMenu = false;
  }

  toggleMobileMenu() {
    this.mobileMenu = !this.mobileMenu;
    this.menuOuvert = false;
  }

  deconnecter() {
    // Supprime token ou info utilisateur stockée
    localStorage.removeItem('token'); // ou sessionStorage selon ton système
    this.userprofil.clearProfile(); // si tu as une méthode pour vider le profil
    // Redirige vers la page de connexion
    this.router.navigate(['/connexion']);
  }
}
