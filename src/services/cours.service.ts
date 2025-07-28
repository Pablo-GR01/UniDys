import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CoursUser } from '../model/coursUser';

@Injectable({
  providedIn: 'root'
})
export class CoursService {
  private apiUrl = 'http://localhost:3000/api/cours';

  constructor(private http: HttpClient) {}

  getCoursParUtilisateur(utilisateurId: string): Observable<CoursUser[]> {
    return this.http.get<CoursUser[]>(`${this.apiUrl}/utilisateur/${utilisateurId}`);
  }
  getCoursById(id: string) {
    return this.http.get<any>(`${this.apiUrl}/cours/${id}`);
  }

  
  
}
