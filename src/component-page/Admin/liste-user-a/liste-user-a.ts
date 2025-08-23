import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; // ⬅️ important pour ngModel

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
  imports: [CommonModule, HttpClientModule, RouterLink, FormsModule],
  templateUrl: './liste-user-a.html',
  styleUrls: ['./liste-user-a.css']
})
export class ListeUserA implements OnInit {
  users: User[] = [];

  // ✅ pour la modification
  showEditModal = false;
  selectedUser: User = {
    _id: '',
    nom: '',
    prenom: '',
    email: '',
    role: 'eleve'
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // Charger les utilisateurs
  loadUsers(): void {
    this.http.get<User[]>('http://localhost:3000/api/unidys/users')
      .subscribe({
        next: users => {
          if (Array.isArray(users)) {
            this.users = users.filter(u => u.role === 'eleve' || u.role === 'prof');
          } else {
            this.users = [];
          }
        },
        error: err => console.error('Erreur API utilisateurs:', err)
      });
  }

  // Supprimer
  deleteUser(userId: string): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;

    this.http.delete(`http://localhost:3000/api/unidys/users/${userId}`)
      .subscribe({
        next: () => {
          this.users = this.users.filter(u => u._id !== userId);
          console.log('Utilisateur supprimé avec succès');
        },
        error: err => console.error('Erreur lors de la suppression:', err)
      });
  }

  // ✅ Ouvrir modal modification
  editUser(user: User): void {
    this.selectedUser = { ...user }; // clone l'objet pour éviter de modifier en direct
    this.showEditModal = true;
  }

  // ✅ Fermer modal
  closeModal(): void {
    this.showEditModal = false;
  }

  // ✅ Enregistrer modification
  updateUser(): void {
    this.http.put(`http://localhost:3000/api/unidys/users/${this.selectedUser._id}`, this.selectedUser)
      .subscribe({
        next: (updatedUser: any) => {
          // Mettre à jour localement la liste
          this.users = this.users.map(u =>
            u._id === updatedUser._id ? updatedUser : u
          );

          this.closeModal();
          console.log('Utilisateur mis à jour avec succès');
        },
        error: err => console.error('Erreur lors de la modification:', err)
      });
  }


  // ✅ Sauvegarde automatique quand on change un champ
  saveUser() {
    if (this.selectedUser && this.selectedUser._id) {
      this.http.put(`http://localhost:3000/api/unidys/users/${this.selectedUser._id}`, this.selectedUser)
        .subscribe({
          next: () => {
            console.log("✅ Modifications sauvegardées avec succès !");
            this.closeModal();
          },
          error: err => console.error("❌ Erreur lors de la sauvegarde :", err)
        });
    }
  }
}
