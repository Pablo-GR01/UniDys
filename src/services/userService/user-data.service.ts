import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Utilisateur {
  _id: string;
  prenom: string;
  nom: string;
  email: string;
  role: string;
  initiale?: string;
  xp?: number;
}

@Injectable({ providedIn: 'root' })
export class UserDataService {
  private apiBase = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // Méthode de connexion
  loginUser(email: string, password: string): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(`${this.apiBase}/unidys/login`, { email, password });
  }

  // Récupérer les infos d’un utilisateur par son ID
  getUserById(id: string): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.apiBase}/users/${id}`);
  }

  // Ajouter de l’XP à un utilisateur
  ajouterXP(userId: string, xp: number): Observable<any> {
    return this.http.post(`${this.apiBase}/users/${userId}/ajouterXP`, { xp });
  }

  // Mettre à jour un utilisateur
  updateUser(userId: string, data: Partial<Utilisateur>): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${this.apiBase}/users/${userId}`, data);
  }
}
