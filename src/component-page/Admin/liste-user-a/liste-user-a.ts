import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface User {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  xp?: number;
  level?: number;
}

@Component({
  selector: 'app-liste-user-a',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterLink],
  templateUrl: './liste-user-a.html',
  styleUrls: ['./liste-user-a.css']
})
export class ListeUserA implements OnInit {
  users: User[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // Fonction pour récupérer les utilisateurs
  // Fonction pour récupérer les utilisateurs
loadUsers(): void {
  this.http.get<User[]>('http://localhost:3000/api/unidys/users')
    .subscribe({
      next: users => {
        if (Array.isArray(users)) {
          // Filtrer uniquement les utilisateurs avec rôle 'eleve' ou 'prof'
          this.users = users.filter(u => u.role === 'eleve' || u.role === 'prof');
        } else {
          this.users = [];
        }
      },
      error: err => console.error('Erreur API utilisateurs:', err)
    });
}

  // Fonction pour supprimer un utilisateur
  deleteUser(userId: string): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;

    this.http.delete(`http://localhost:3000/api/unidys/users/${userId}`)
      .subscribe({
        next: () => {
          // Retirer l'utilisateur du tableau local pour rafraîchir l'affichage
          this.users = this.users.filter(u => u._id !== userId);
          console.log('Utilisateur supprimé avec succès');
        },
        error: err => console.error('Erreur lors de la suppression:', err)
      });
  }
}
