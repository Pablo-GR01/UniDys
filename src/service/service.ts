import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface UserData {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  role: 'prof' | 'eleve';
  codeProf?: string;
}

@Injectable({ providedIn: 'root' })

export class Service {
  private API_URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  registerUser(data: any): Observable<any> {
  return this.http.post('http://localhost:3000/api/inscription', data);
  }

}