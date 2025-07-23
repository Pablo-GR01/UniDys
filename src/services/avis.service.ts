import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Avis {
  prenom: string;
  nom: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class AvisService {
  private apiUrl = 'http://localhost:3000/api/avis';

  constructor(private http: HttpClient) {}

  envoyerAvis(avis: Avis): Observable<any> {
    return this.http.post(this.apiUrl, avis);
  }
}
