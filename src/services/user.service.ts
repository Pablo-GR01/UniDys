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

  getInitiales(): string {
    if (!this.utilisateur) return 'IN';
    const { prenom, nom } = this.utilisateur;
    return `${prenom?.charAt(0) || ''}${nom?.charAt(0) || ''}`.toUpperCase();
  }

  getNomComplet(): string {
    if (!this.utilisateur) return 'Invité';
    const { prenom, nom } = this.utilisateur;
    return `${nom} ${prenom}`;
  }

  setUser(user: any) {
    this.utilisateur = user;
    localStorage.setItem('utilisateur', JSON.stringify(user));
  }

  clearUser() {
    this.utilisateur = null;
    localStorage.removeItem('utilisateur');
  }

  // AJOUTER CE GETTER POUR ACCEDER A L'UTILISATEUR DEPUIS L'EXTERIEUR
  getUtilisateur(): { prenom: string; nom: string; email: string; role: string } | null {
    return this.utilisateur;
  }
}
