import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-dernier-qcm',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './dernier-qcm.html',
  styleUrls: ['./dernier-qcm.css']
})
export class DerniersQCM implements OnInit {

  derniersQcm: any[] = [];
  loading: boolean = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    const userId = user ? JSON.parse(user)._id : null;
  
    if (!userId) {
      console.warn('Aucun utilisateur connecté ou ID introuvable');
      this.loading = false;
      return;
    }
  
    this.http.get<any[]>(`http://localhost:3000/api/qcm/results/user/${userId}`).subscribe({
      next: data => {
        this.derniersQcm = data.map(qcm => ({
          _id: qcm._id,
          coursId: qcm.coursId,
          titre: `Cours #${qcm.coursId}`,
          score: qcm.score,
          xpGagne: qcm.xpGagne,
          date: new Date(qcm.createdAt),
          isNew: (new Date().getTime() - new Date(qcm.createdAt).getTime()) < 24 * 60 * 60 * 1000 // 🔹 ajouter un booléen
        }));
  
        this.derniersQcm.sort((a, b) => b.date.getTime() - a.date.getTime());
        this.loading = false;
      },
      error: err => {
        console.error('Erreur lors de la récupération des QCM', err);
        this.loading = false;
      }
    });
  }
  
}
