import { Injectable } from '@angular/core';
import { AuthService } from '../userService/Auth.Service';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  constructor(private authService: AuthService) {}

  getInitiales(): string {
    const user = this.authService.getUser();
    return user?.initiale || 'IN';
  }

  getNomComplet(): string {
    const user = this.authService.getUser();
    return user ? `${user.prenom} ${user.nom}` : 'Invité';
  }

  getRole(): string {
    const user = this.authService.getUser();
    return user?.role || 'invité';
  }
}
