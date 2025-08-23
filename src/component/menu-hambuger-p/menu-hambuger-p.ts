import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router,RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Icon } from '../icon/icon';

import { ProfileService } from '../../services/userService/Profile.Service';

@Component({
  selector: 'app-menu-hambuger-p',
  imports: [CommonModule,RouterLink,HttpClientModule,Icon],
  templateUrl: './menu-hambuger-p.html',
  styleUrl: './menu-hambuger-p.css'
})
export class MenuHamburgerP {
  menuOuvert = false;
  mobileMenu = false;
  constructor(public userprofil: ProfileService,
    private router: Router
  ) { }

  toggleMenu() {
    this.menuOuvert = !this.menuOuvert;
    this.mobileMenu = false;
  }

  toggleMobileMenu() {
    this.mobileMenu = !this.mobileMenu;
    this.menuOuvert = false;
  }

  deconnecter() {
    localStorage.removeItem('token');       // supprime token
    localStorage.removeItem('nomProf');     // supprime nom du professeur
    this.userprofil.clearProfile();         // si tu as une méthode pour vider le profil
    this.router.navigate(['/connexion']);   // redirige vers connexion
  }
  

}
