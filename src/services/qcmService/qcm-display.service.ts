import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface QcmQuestion {
  question: string;
  reponses: string[];
  bonneReponse: number;
  xp: number;
}

export interface QcmResult {
  qcmId: string;
  userId: string;
  reponses: number[];
  score: number;
  xpGagne: number;
}

@Injectable({
  providedIn: 'root'
})
export class QcmDisplayService {

  private apiBase = 'http://localhost:3000/api/qcm';

  constructor(private http: HttpClient) {}

  // Récupérer toutes les questions d’un QCM
  getQuestions(qcmId: string): Observable<QcmQuestion[]> {
    return this.http.get<QcmQuestion[]>(`${this.apiBase}/questions/${qcmId}`);
  }

  // Récupérer les résultats d’un utilisateur pour un QCM
  getResultsByUser(qcmId: string, userId: string): Observable<QcmResult | null> {
    return this.http.get<QcmResult | null>(`${this.apiBase}/results/${qcmId}/${userId}`);
  }
}
