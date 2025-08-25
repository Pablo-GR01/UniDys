import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Icon } from '../icon/icon';
import { Subscription } from 'rxjs';

import { ProfileService } from '../../services/userService/Profile.Service';

@Component({
  selector: 'app-menu-hambuger-p',
  standalone: true, // ⚡ important sinon Angular ne sait pas que c’est un standalone
  imports: [CommonModule, RouterLink, HttpClientModule, Icon],
  templateUrl: './menu-hambuger-p.html',
  styleUrls: ['./menu-hambuger-p.css'] // ⚡ attention : c’est "styleUrls" au pluriel
})
export class MenuHamburgerP implements OnInit, OnDestroy {
  menuOuvert = false;
  mobileMenu = false;
  private routerSub!: Subscription;

  constructor(
    public userprofil: ProfileService,
    private router: Router
  ) {}

  ngOnInit() {
    // 🔹 Fermer automatiquement quand on change de page
    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.fermerMenus();
      }
    });
  }

  ngOnDestroy() {
    if (this.routerSub) this.routerSub.unsubscribe();
  }

  toggleMenu() {
    this.menuOuvert = !this.menuOuvert;
    this.mobileMenu = false;
  }

  toggleMobileMenu() {
    this.mobileMenu = !this.mobileMenu;
    this.menuOuvert = false;
  }

  fermerMenus() {
    this.menuOuvert = false;
    this.mobileMenu = false;
  }

  // 🔹 Fermer si on clique en dehors
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    const insideMenu = target.closest('app-menu-hambuger-p'); // vérifie si le clic est dans le menu
    if (!insideMenu) {
      this.fermerMenus();
    }
  }

  deconnecter() {
    localStorage.removeItem('token');       // supprime token
    localStorage.removeItem('nomProf');     // supprime nom du professeur
    this.userprofil.clearProfile();         // vide le profil
    this.router.navigate(['/connexion']);   // redirige vers connexion
  }
}
