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
    // 🔹 Récupération de l'ID utilisateur depuis localStorage
    const user = localStorage.getItem('user');
    const userId = user ? JSON.parse(user)._id : null;

    if (!userId) {
      console.warn('Aucun utilisateur connecté ou ID introuvable');
      this.loading = false;
      return;
    }

    // 🔹 Appel à l'API pour récupérer les QCM
    this.http.get<any[]>(`http://localhost:3000/api/unidys/qcmresults/${userId}`)
      .subscribe({
        next: data => {
          // Mapping des résultats
          this.derniersQcm = data.map(qcm => ({
            _id: qcm._id,
            coursId: qcm.coursId, // pour le moment c'est juste l'ID
            titre: qcm.titre || `Cours #${qcm.coursId}`, // fallback si titre non fourni
            score: qcm.score,
            xpGagne: qcm.xpGagne,
            date: new Date(qcm.createdAt).toLocaleString()
          }));

          // Trier par date décroissante
          this.derniersQcm.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

          this.loading = false;
        },
        error: err => {
          console.error('Erreur lors de la récupération des QCM', err);
          this.loading = false;
        }
      });
  }
}
