import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule, HttpEventType } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

// Import jsPDF
import jsPDF from 'jspdf';

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

  constructor(private http: HttpClient, private sanitizer: DomSanitizer, private router: Router) {}

  ngOnInit() {
    // Ici tu peux adapter pour récupérer nomProf comme tu veux
    this.nomProf = 'Jean Dupont';
    this.chargerCours();
  }

  chargerCours() {
    // Simule ta récupération API ici, remplace par vraie API ensuite
    this.cours = [
      {
        _id: '1',
        titre: 'Cours de Mathématiques',
        matiere: 'Math',
        niveau: 'CM2',
        qcm: {
          questions: [
            { intitule: 'Combien font 2+2 ?', reponses: ['3', '4', '5'] },
            { intitule: 'Racine carrée de 9 ?', reponses: ['2', '3', '4'] },
          ],
        },
      },
      {
        _id: '2',
        titre: 'Cours de Français',
        matiere: 'Français',
        niveau: 'CM1',
        qcm: null,
      },
    ];
  }

  ouvrirPopup(cours: any) {
    this.coursSelectionne = cours;
    this.popupVisible = true;

    // Génère PDF à la volée avec jsPDF (exemple simple)
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text(cours.titre || 'Titre inconnu', 10, 20);
    doc.setFontSize(16);
    doc.text(`Matière : ${cours.matiere || 'Non spécifiée'}`, 10, 30);

    if (cours.qcm && cours.qcm.questions && cours.qcm.questions.length > 0) {
      doc.setFontSize(18);
      doc.text('QCM', 10, 45);
      let y = 55;
      doc.setFontSize(14);
      cours.qcm.questions.forEach((q: any, i: number) => {
        doc.text(`${i + 1}. ${q.intitule}`, 10, y);
        y += 8;
        q.reponses.forEach((r: string) => {
          doc.text(`- ${r}`, 15, y);
          y += 7;
        });
        y += 5;
      });
    }

    const pdfDataUri = doc.output('datauristring');
    this.pdfUrlSanitized = this.sanitizer.bypassSecurityTrustResourceUrl(pdfDataUri);
  }

  fermerPopup() {
    this.popupVisible = false;
    this.coursSelectionne = null;
    this.pdfUrlSanitized = null;
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

  supprimerCours(cours: any) {
    this.cours = this.cours.filter((c) => c._id !== cours._id);
    if (this.coursSelectionne?._id === cours._id) this.fermerPopup();
  }

  // Exemple navigation vers page détail
  voirDetail(cours: any) {
    this.router.navigate(['/cours-detail', cours._id]);
  }
}
