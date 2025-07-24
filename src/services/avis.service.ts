import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Avis } from '../model/avis';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvisService {
  private apiUrl = 'http://localhost:3000/avis'; // adapte au besoin

  constructor(private http: HttpClient) {}

  getAvis(): Observable<Avis[]> {
    return this.http.get<Avis[]>(this.apiUrl);
  }
}
