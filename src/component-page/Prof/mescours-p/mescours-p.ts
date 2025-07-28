import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-mescours-p',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterLink],
  templateUrl: './mescours-p.html',
  styleUrls: ['./mescours-p.css'],
})
export class MescoursP implements OnInit {
  cours: any[] = [];
  nomProf: string = '';
  coursSelectionne: any = null;
  popupVisible: boolean = false;
  pdfUrlSanitized: SafeResourceUrl | null = null;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    const utilisateurConnecte = localStorage.getItem('utilisateur');

    if (utilisateurConnecte) {
      let utilisateur;
      try {
        utilisateur = JSON.parse(utilisateurConnecte);
      } catch (e) {
        console.error('Erreur parsing JSON utilisateur dans localStorage', e);
        utilisateur = null;
      }

      if (utilisateur) {
        if (typeof utilisateur.prenom === 'string' && typeof utilisateur.nom === 'string') {
          this.nomProf = `${utilisateur.prenom} ${utilisateur.nom}`;
        } else if (typeof utilisateur.nom === 'string') {
          this.nomProf = utilisateur.nom;
        } else {
          this.nomProf = '';
          console.warn('Le format de l\'utilisateur ne contient pas nom/prenom valides');
        }

        console.log('NomProf utilisé:', this.nomProf);

        if (this.nomProf) {
          this.http
            .get<any[]>(`http://localhost:3000/api/cours/prof/${encodeURIComponent(this.nomProf)}`)
            .subscribe({
              next: (data) => {
                this.cours = data;
                console.log('Cours chargés:', this.cours);
              },
              error: (err) => {
                console.error('Erreur récupération cours:', err);
              },
            });
        }
      } else {
        console.warn('Utilisateur localStorage invalide ou malformé');
      }
    } else {
      console.warn('Aucun utilisateur connecté trouvé dans le localStorage');
    }
  }

  getImageParMatiere(matiere: string): string {
    const lower = matiere.toLowerCase();
    if (lower.includes('français')) return 'assets/coursfrançais.png';
    if (lower.includes('math')) return 'assets/coursmaths.png';
    if (lower.includes('histoire')) return 'assets/courshistoire.png';
    if (lower.includes('svt')) return 'assets/svt.png';
    if (lower.includes('anglais')) return 'assets/anglais.png';
    return 'assets/cours-default.png';
  }

  ouvrirPopup(cours: any) {
    this.coursSelectionne = cours;
    this.popupVisible = true;

    if (cours.fichierPdf) {
      const url = `http://localhost:3000/uploads/${cours.fichierPdf}`;
      this.pdfUrlSanitized = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    } else {
      this.pdfUrlSanitized = null;
    }
  }

  fermerPopup() {
    this.popupVisible = false;
    this.coursSelectionne = null;
    this.pdfUrlSanitized = null;
  }
}
