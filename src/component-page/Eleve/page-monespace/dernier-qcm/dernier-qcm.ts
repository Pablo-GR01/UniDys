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
  showPopup: boolean = false;

  // Pagination
  currentPage: number = 1;
  pageSize: number = 4;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadDerniersQcm();
  }

  // Charger les derniers QCM de l'utilisateur
  loadDerniersQcm() {
    const user = localStorage.getItem('user');
    const userId = user ? JSON.parse(user)._id : null;

    if (!userId) {
      console.warn('Aucun utilisateur connecté ou ID introuvable');
      this.loading = false;
      return;
    }

    this.loading = true;
    this.http.get<any[]>(`http://localhost:3000/api/qcm/results/user/${userId}`).subscribe({
      next: data => {
        this.derniersQcm = data.map(qcm => ({
          _id: qcm._id,
          coursId: qcm.qcmId?._id || null,
          // 🔥 Ici on récupère le titre du cours depuis qcm.qcmId.titre
          titre: `QCM : ${qcm.qcmId?.titre || 'Cours Inconnu'}`,
          matiere: qcm.qcmId?.matiere || 'Matière inconnue',
          score: qcm.score,
          xpGagne: qcm.xpGagne,
          date: new Date(qcm.createdAt),
          isNew: (new Date().getTime() - new Date(qcm.createdAt).getTime()) < 24 * 60 * 60 * 1000
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

  // Envoyer un résultat de QCM
  sendQcmResult(qcmId: string, score: number, reponses: number[], xpGagne: number) {
    const user = localStorage.getItem('user');
    const userId = user ? JSON.parse(user)._id : null;

    if (!userId) {
      console.warn('Aucun utilisateur connecté ou ID introuvable');
      return;
    }

    const body = { userId, qcmId, score, reponses, xpGagne };

    this.http.post('http://localhost:3000/api/qcm/resultats', body).subscribe({
      next: res => {
        console.log('Résultat QCM envoyé avec succès', res);
        this.loadDerniersQcm(); // Recharger après envoi
      },
      error: err => {
        console.error('Erreur lors de l\'envoi du QCM', err);
      }
    });
  }

  // QCM affichés sur la page principale (2 premiers)
  get displayedQcm() {
    return this.derniersQcm.slice(0, 2);
  }

  // QCM paginés pour la popup
  get paginatedQcm() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.derniersQcm.slice(start, end);
  }

  // Nombre total de pages
  get totalPages() {
    return Math.ceil(this.derniersQcm.length / this.pageSize);
  }

  // Changer de page
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Ouvrir/fermer popup
  togglePopup() {
    this.showPopup = !this.showPopup;
    this.currentPage = 1;
  }
}
