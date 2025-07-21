import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserService {
  private utilisateur: { prenom: string; nom: string; email: string; role: string } | null = null;

  constructor() {
    const data = localStorage.getItem('utilisateur');
    if (data) {
      this.utilisateur = JSON.parse(data);
    }
  }

  setUser(user: any) {
    this.utilisateur = user;
    localStorage.setItem('utilisateur', JSON.stringify(user));
  }

  getUser() {
    return this.utilisateur;
  }

  getInitiales(): string {
    if (!this.utilisateur) return '';
    const { prenom, nom } = this.utilisateur;
    return `${prenom?.charAt(0) || ''}${nom?.charAt(0) || ''}`.toUpperCase();
  }

  clearUser() {
    this.utilisateur = null;
    localStorage.removeItem('utilisateur');
  }
}
