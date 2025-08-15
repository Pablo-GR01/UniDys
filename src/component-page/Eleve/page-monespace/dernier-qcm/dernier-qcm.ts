import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dernier-qcm',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dernier-qcm.html',
  styleUrls: ['./dernier-qcm.css'] // corrige styleUrl -> styleUrls
})
export class DerniersQCM implements OnInit {

  derniersQcm: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // 🔹 Récupération de l'userId depuis localStorage
    const user = localStorage.getItem('user');
    const userId = user ? JSON.parse(user)._id : null;

    if (!userId) {
      console.warn('Aucun userId trouvé');
      return;
    }

    this.http.get<any[]>(`/api/qcm/user/${userId}`).subscribe({
      next: (data) => {
        this.derniersQcm = data.map(qcm => ({
          titre: qcm.coursId, // ou un titre plus clair depuis ton backend
          score: qcm.score,
          xpGagne: qcm.xpGagne,
          date: qcm.createdAt
        }));
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des QCM', err);
      }
    });
  }
}
