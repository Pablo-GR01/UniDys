// qcm-display.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface QcmResult {
  qcmId: string;
  userId: string;
  reponses: number[];
  score: number;
  xpGagne: number;
  date: string; // ⚡ Ajouter date pour trier
}

@Injectable({
  providedIn: 'root'
})
export class QcmDisplayService {
  private apiBase = 'http://localhost:3000/api/qcm';

  constructor(private http: HttpClient) {}

  // Récupérer les résultats d’un utilisateur
  getResultsByUser(userId: string): Observable<QcmResult[]> {
    return this.http.get<QcmResult[]>(`${this.apiBase}/results/user/${userId}`);
  }
}
