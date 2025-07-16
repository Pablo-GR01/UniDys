import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';          
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';  

@Component({
  selector: 'app-menu-hamburger',
  templateUrl: './menu-hamburger.html',
  styleUrls: ['./menu-hamburger.css'],
  standalone: true,
  imports: [RouterModule, CommonModule, HttpClientModule]
})
export class HamburgerMenu implements OnInit {
  userNom = '';
  userPrenom = '';
  userInitiales = ''; // ← Utilisé dans l’avatar
  userColor = '';
  isOpen = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const userId = localStorage.getItem('userId');

    this.userInitiales = 'AB';
    console.log('Initiales utilisateur:', this.userInitiales);


    if (!userId) {
      console.warn('Aucun userId trouvé dans le localStorage');
      this.userNom = 'Inconnu';
      this.userPrenom = '';
      this.userInitiales = '??';
      this.userColor = '#999999';
      return;
    }

    this.http.get<{ nom: string; prenom: string; initiale?: string }>(
      `http://localhost:3000/api/utilisateur-connecte?id=${userId}`
    ).subscribe({
      next: user => {
        this.userNom = user.nom;
        this.userPrenom = user.prenom;
        // Prend la valeur "initiale" si elle existe, sinon on la génère
        this.userInitiales = user.initiale || 
          ((user.prenom?.charAt(0) || '') + (user.nom?.charAt(0) || '')).toUpperCase();

        // Couleur avatar
        const savedColor = localStorage.getItem('userColor');
        if (savedColor) {
          this.userColor = savedColor;
        } else {
          this.userColor = this.getRandomColor();
          localStorage.setItem('userColor', this.userColor);
        }
      },
      error: err => {
        console.error('Erreur lors de la récupération de l’utilisateur :', err);
        this.userNom = 'Inconnu';
        this.userPrenom = '';
        this.userInitiales = '??';
        this.userColor = '#999999';
      }
    });
  }

  getRandomColor(): string {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 60%)`;
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }
}
