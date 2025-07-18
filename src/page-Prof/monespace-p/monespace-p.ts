import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Header2 } from '../../../public/component/header2/header2';
import { Section4 } from '../../component-prof/section4/section4';
import { Section13 } from '../../component-eleve/section13/section13';

@Component({
  selector: 'app-monespace-p',
  templateUrl: './monespace-p.html',
  styleUrls: ['./monespace-p.css'],
  standalone: true,
  imports: [Header2, Section4, Section13],
})
export class MonespaceP implements OnInit {
  welcomeMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      this.welcomeMessage = 'Utilisateur non connecté';
      return;
    }

    this.http.get<{ nom: string, prenom: string, role: string }>(
      `http://localhost:3000/api/user/${userId}`
    ).subscribe({
      next: (res) => {
        this.welcomeMessage = res.role === 'prof'
          ? `Bonjour Mr ${res.nom} ${res.prenom}`
          : `Bonjour ${res.prenom} ${res.nom}`;
      },
      error: (err) => {
        console.error('Erreur API:', err);
        this.welcomeMessage = 'Erreur lors du chargement du profil';
      }
    });
  }
}