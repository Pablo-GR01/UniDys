import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Cours {
  _id: string;
  titre: string;
  description: string;
  niveau: string;
  matiere: string;
  professeur?: string;     // côté UI
  imageMatiere?: string;
  lienYoutube?: string;
  // nomProf?: string;      // existe peut-être côté backend
}

@Component({
  selector: 'app-liste-cours',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, RouterLink],
  templateUrl: './liste-cours-a.html',
  styleUrls: ['./liste-cours-a.css']
})
export class ListeCoursA implements OnInit {
  cours: Cours[] = [];
  showEditModal = false;
  isSaving = false;

  selectedCours: Cours = {
    _id: '',
    titre: '',
    description: '',
    niveau: '',
    matiere: '',
    professeur: '',
    imageMatiere: '',
    lienYoutube: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCours();
  }

  // Charger tous les cours
  loadCours(): void {
    this.http.get<any[]>('http://localhost:3000/api/unidys/cours')
      .subscribe({
        next: data => {
          const arr = Array.isArray(data) ? data : [];
          // Normaliser pour l’UI : professeur = professeur || nomProf
          this.cours = arr.map((c: any) => {
            const professeur = c.professeur ?? c.nomProf ?? '';
            const imageMatiere = c.imageMatiere ?? this.getImageParMatiere(c.matiere || '');
            return { ...c, professeur, imageMatiere } as Cours;
          });
        },
        error: err => console.error('Erreur API cours:', err)
      });
  }

  // Supprimer un cours
  deleteCours(coursId: string): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) return;

    this.http.delete(`http://localhost:3000/api/unidys/cours/${coursId}`)
      .subscribe({
        next: () => {
          this.cours = this.cours.filter(c => c._id !== coursId);
          console.log('Cours supprimé avec succès');
        },
        error: err => console.error('Erreur lors de la suppression:', err)
      });
  }

  // Ouvrir modal pour modifier
  editCours(cours: Cours): void {
    this.selectedCours = { ...cours };
    this.showEditModal = true;
  }

  // Fermer modal
  closeModal(): void {
    this.showEditModal = false;
  }

  // Modifier un cours (gère { message, cours } ou l'objet direct)
  updateCours(): void {
    if (!this.selectedCours._id || this.isSaving) return;

    // Mapper le champ UI -> backend si votre schéma attend nomProf
    const payload: any = { ...this.selectedCours };
    if (payload.professeur) {
      payload.nomProf = payload.professeur; // <-- backend
    }
    delete payload.professeur; // éviter un champ inconnu côté backend
    // Optionnel: éviter d'envoyer l'_id dans le body
    delete payload._id;

    this.isSaving = true;
    this.http.put<any>(`http://localhost:3000/api/unidys/cours/${this.selectedCours._id}`, payload)
      .subscribe({
        next: (resp) => {
          // Certains contrôleurs renvoient { message, cours }, d’autres renvoient directement l’objet
          const updated: any = resp?.cours ?? resp;

          // Normaliser pour l’UI
          const normalized: Cours = {
            ...updated,
            professeur: updated.professeur ?? updated.nomProf ?? this.selectedCours.professeur,
            imageMatiere: updated.imageMatiere ?? this.getImageParMatiere(updated.matiere || '')
          };

          this.cours = this.cours.map(c => c._id === normalized._id ? normalized : c);
          this.isSaving = false;
          this.closeModal();
          console.log('Cours mis à jour avec succès');
        },
        error: err => {
          this.isSaving = false;
          console.error('Erreur lors de la modification:', err);
          alert('❌ Erreur lors de la modification du cours.');
        }
      });
  }

  // Générer image par défaut si aucune image
  getImageParMatiere(matiere: string): string {
    switch ((matiere || '').toLowerCase()) {
      case 'maths': return 'assets/coursmaths.png';
      case 'français': return 'assets/coursfrançais.png';
      case 'histoire': return 'assets/courshistoire.png';
      case 'sciences': return 'assets/sciences.png';
      default: return 'assets/img/default.jpg';
    }
  }

  trackById(_index: number, item: Cours) { return item._id; }
}
