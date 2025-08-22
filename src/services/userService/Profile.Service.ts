import { Injectable } from '@angular/core';
import { AuthService } from '../userService/Auth.Service';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  constructor(private authService: AuthService) {}

  getUser() {
    return this.authService.getUser();
  }

  setUser(user: any) {
    this.authService.setUser(user);
  }

  ajouterXP(xp: number) {
    const user = this.getUser();
    if (!user) return;
    user.xp = (user.xp || 0) + xp;
    this.setUser(user);
  }

  getInitiales(): string {
    const user = this.getUser();
    return user?.initiale || 'IN';
  }

  getNomComplet(): string {
    const user = this.getUser();
    return user ? `${user.prenom} ${user.nom}` : 'Invité';
  }

  getRole(): string {
    const user = this.getUser();
    return user?.role || 'invité';
  }

  // -------------------------------
  // Ajout de la méthode clearProfile
  clearProfile() {
    this.authService.setUser(null); // vide l'utilisateur dans AuthService
  }
}
