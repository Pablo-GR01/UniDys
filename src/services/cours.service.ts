import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CoursUtilisateur } from '../model';

@Injectable({ providedIn: 'root' })
export class CoursService {
  private apiUrl = 'http://localhost:3000/api/cours-utilisateur';

  constructor(private http: HttpClient) {}

  getCoursParUtilisateur(utilisateurId: string): Observable<CoursUtilisateur[]> {
    return this.http.get<CoursUtilisateur[]>(`${this.apiUrl}/utilisateur/${utilisateurId}`);
  }
}
