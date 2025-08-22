import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Eleve {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  xp: number;
  level: number; // 👈 ajouter level ici
}

@Component({
  selector: 'app-tableau',
  templateUrl: './tableau.html',
  styleUrls: ['./tableau.css'],
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule]
})
export class Tableau implements OnInit {
  eleves: Eleve[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Eleve[]>('http://localhost:3000/api/eleves').subscribe({
      next: (data) => {
        this.eleves = data
          .map(e => ({ 
            ...e, 
            level: Math.floor(e.xp / 100) // calcul simple du level
          }))
          .sort((a, b) => b.xp - a.xp);
      },
      error: (err) => console.error('Erreur récupération des élèves', err)
    });
  }
}
