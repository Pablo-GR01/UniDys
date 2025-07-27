import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Avis } from '../model/avis';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvisService {
  private baseUrl = 'http://localhost:3000/api/avis';

  constructor(private http: HttpClient) {}

  getAvis(): Observable<Avis[]> {
    return this.http.get<Avis[]>(this.baseUrl);
  }

  postAvis(avis: Partial<Avis>): Observable<any> {
    return this.http.post(this.baseUrl, avis);
  }
}
