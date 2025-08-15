import { Injectable } from '@angular/core';
import { UserStorageService } from './user-storage.service';

export interface Utilisateur {
  _id: string;
  prenom: string;
  nom: string;
  email: string;
  role: string;
  initiale: string;
}

@Injectable({ providedIn: 'root' })
export class UserInfoService {
  constructor(private storage: UserStorageService) {}

  getUser(): Utilisateur | null {
    return this.storage.get();
  }

  getInitiales(): string {
    return this.getUser()?.initiale || 'IN';
  }

  getNomComplet(): string {
    const user = this.getUser();
    return user ? `${user.prenom} ${user.nom}` : 'Invité';
  }
}
