import { Header } from "../../../public/component/header/header";
import { Section12 } from '../../component-eleve/section12/section12'
import { Section13 } from '../../component-eleve/section13/section13'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-monespace',
  imports: [Header, Section12, Section13],
  templateUrl: './monespace.html',
  styleUrl: './monespace.css'
})
export class Monespace implements OnInit {

  user = {
    role: '',
    lastName: '',
    firstName: ''
  };

  welcomeMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Si tu utilises JWT, récupère le token ici (exemple depuis localStorage)
    const token = localStorage.getItem('token'); 

    // Prépare les headers avec le token pour l'authentification
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;

    this.http.get<{ role: string; lastName: string; firstName: string }>(
      '/api/user/me',
      { headers }
    ).subscribe({
      next: (user) => {
        this.user = user;
        this.welcomeMessage = this.user.role === 'prof'
          ? `Bonjour Mr ${this.user.lastName} ${this.user.firstName}`
          : `Bonjour ${this.user.lastName} ${this.user.firstName}`;
      },
      error: (err) => {
        console.error('Erreur récupération user', err);
        this.welcomeMessage = 'Erreur lors du chargement du profil';
      }
    });
  }
}
