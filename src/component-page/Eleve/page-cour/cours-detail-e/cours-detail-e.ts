import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderE } from '../../../../component/header-e/header-e';
import { ProfileService } from '../../../../services/userService/Profile.Service';
import { Subscription, interval } from 'rxjs';
import { Icon } from "../../../../component/icon/icon";

/* ========================= INTERFACES ========================= */
interface QcmQuestion {
  question: string;
  reponses: string[];
  bonneReponse: number;
  xp: number;
}

interface Cours {
  titre: string;
  niveau: string;
  matiere: string;
}

/* ========================= COMPOSANT ========================= */
@Component({
  selector: 'app-cours-detail-e',
  templateUrl: './cours-detail-e.html',
  styleUrls: ['./cours-detail-e.css'],
  standalone: true,
  imports: [CommonModule, HeaderE, FormsModule, HttpClientModule, Icon],
})
export class CoursDetailE implements OnInit, OnDestroy {

  /* ========================= VARIABLES PRINCIPALES ========================= */
  contenuHtml: SafeHtml | null = null;
  qcm: QcmQuestion[] = [];
  cours: Cours | null = null;
  reponsesUtilisateur: (number | null)[] = [];
  reponsesSauvegardees: number[] = [];

  contrasteActif = false;
  couleurTexte = '#ffffff';
  couleurFond = '#000000';

  grasActif = false;
  italiqueActif = false;
  soulignerActif = false;
  barrerActif = false;
  surlignerActif = false;

  idCours: string | null = null;
  userId: string | null = null;

  resultat: number | null = null;
  xp = 0;
  message = '';
  loading = true;
  showPopup = false;
  qcmDejaFait = false;

  private apiBase = 'http://localhost:3000/api';
  private refreshSub: Subscription | null = null;

  texteTaille = 22;
  policeTexte = 'Arial';
  policesDisponibles: string[] = [
    'Arial', 'Times New Roman', 'Georgia', 'Verdana',
    'Courier New', 'Trebuchet MS', 'Roboto', 'Open Sans', 'Comic Sans MS'
  ];

  couleursSurligneur = [
    { nom: 'Jaune', code: 'jaune' },
    { nom: 'Vert', code: 'vert' },
    { nom: 'Bleu', code: 'bleu' },
    { nom: 'Rose', code: 'rose' },
    { nom: 'Orange', code: 'orange' },
    { nom: 'Violet', code: 'violet' },
  ];

  couleurSurligneur = 'jaune';

  /* ========================= CONSTRUCTEUR ========================= */
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private profileService: ProfileService,
    private renderer: Renderer2
  ) {}

 /* ========================= CYCLE DE VIE ========================= */
ngOnInit(): void {
  this.idCours = this.route.snapshot.paramMap.get('id');
  const user = this.profileService.getUser();
  this.userId = user?._id || null;

  this.restaurerPreferences();

  if (!this.idCours) { 
    this.loading = false; 
    return; 
  }

  // ✅ Chargement immédiat à 0s (une seule fois)
  this.chargerCoursEtQcm();
}

ngOnDestroy(): void {
  if (this.refreshSub) {
    this.refreshSub.unsubscribe();
  }
}


  /* ========================= RESTAURER PREFERENCES ========================= */
  private restaurerPreferences(): void {
    const savedTaille = localStorage.getItem('texteTaille');
    if (savedTaille) this.texteTaille = parseInt(savedTaille, 10);

    const savedPolice = localStorage.getItem('policeTexte');
    if (savedPolice) this.policeTexte = savedPolice;
  }

  /* ========================= CHARGEMENT COURS ET QCM ========================= */
  private chargerCoursEtQcm(): void {
    this.loading = true;
    this.http
      .get<{ html: string; qcm: QcmQuestion[]; coursInfo: Cours }>(`${this.apiBase}/cours/complet/${this.idCours}`)
      .subscribe({
        next: ({ html, qcm = [], coursInfo }) => {
          this.contenuHtml = this.sanitizer.bypassSecurityTrustHtml(html);
          this.qcm = qcm;
          this.cours = coursInfo;
          if (!this.qcmDejaFait) this.reponsesUtilisateur = qcm.map(() => null);

          if (this.userId && this.qcm.length > 0) {
            this.http.get<any>(`${this.apiBase}/qcm/resultats/${this.idCours}/${this.userId}`).subscribe({
              next: (res) => {
                if (res) {
                  this.qcmDejaFait = true;
                  this.reponsesSauvegardees = res.reponses || [];
                  this.resultat = res.score ?? 0;
                  this.xp = res.xpGagne ?? 0;
                  this.reponsesUtilisateur = [...this.reponsesSauvegardees];
                }
              },
              error: () => {}
            });
          }
          this.loading = false;
        },
        error: (err) => { console.error('Erreur chargement cours:', err); this.loading = false; }
      });
  }

  /* ========================= MODIFICATION TAILLE ET POLICE ========================= */
  augmenterTexte(): void { 
    if(this.texteTaille<38){this.texteTaille+=2; localStorage.setItem('texteTaille', this.texteTaille.toString());} 
  }
  diminuerTexte(): void { 
    if(this.texteTaille>22){this.texteTaille-=2; localStorage.setItem('texteTaille', this.texteTaille.toString());} 
  }
  changerPolice(): void { 
    localStorage.setItem('policeTexte', this.policeTexte); 
  }
  changerContraste() { 
    this.contrasteActif = !this.contrasteActif; 
  }

  /* ========================= QCM ========================= */
  estCoche(indexQ: number, indexR: number): boolean {
    return this.qcmDejaFait ? this.reponsesSauvegardees[indexQ] === indexR : this.reponsesUtilisateur[indexQ] === indexR;
  }
  questionEstJuste(indexQ: number): boolean { return this.reponsesUtilisateur[indexQ] === this.qcm[indexQ]?.bonneReponse; }
  isBonneReponse(question: QcmQuestion, indexR: number): boolean { return indexR === question.bonneReponse; }

  validerQCM(): void {
    if(this.qcmDejaFait) return;
    for(let i=0;i<this.qcm.length;i++){if(this.reponsesUtilisateur[i]===null){alert(`Réponds à la question ${i+1}`); return;}}
    let score=0,xpTotal=0;
    this.qcm.forEach((q,i)=>{if(this.reponsesUtilisateur[i]===q.bonneReponse){score++; xpTotal+=q.xp||0;}});
    this.resultat=score; this.xp=xpTotal;
    this.message=score===this.qcm.length?'🎉 Bravo ! Toutes les réponses sont correctes.':score===0?'❌ Perdu ! Aucune bonne réponse.':'👍 Bien essayé, mais tu peux faire mieux !';
    this.qcmDejaFait=true; 
    this.reponsesSauvegardees=this.reponsesUtilisateur.filter((r):r is number=>r!==null); 
    this.showPopup=true;
    this.sauvegarderQCM(); 
    this.ajouterXPServeur();
  }

  private sauvegarderQCM(): void {
    if(!this.userId || !this.idCours) return;
    const reponsesFinales=this.reponsesUtilisateur.filter((r):r is number=>r!==null);
    this.http.post(`${this.apiBase}/qcm/resultats`,{userId:this.userId,qcmId:this.idCours,score:this.resultat,reponses:reponsesFinales,xpGagne:this.xp}).subscribe();
  }

  private ajouterXPServeur(): void {
    if(!this.userId || this.xp<=0) return;
    this.http.post<{updatedXP:number}>(`${this.apiBase}/users/${this.userId}/ajouterXP`,{xp:this.xp}).subscribe(res=>{
      const user=this.profileService.getUser(); 
      if(user){user.xp=res.updatedXP; localStorage.setItem('user',JSON.stringify(user));}
    });
  }

  fermerPopup(): void { this.showPopup=false; }
  get xptotal(): number { return this.qcm.reduce((t,q)=>t+(q.xp||0),0); }

  /* ========================= BARRE D'OUTILS DE STYLE ========================= */
  toggleGras() { this.applyStyle("gras"); }
  toggleItalique() { this.applyStyle("italique"); }
  toggleSouligner() { this.applyStyle("souligne"); }
  toggleBarrer() { this.applyStyle("barre"); }
  toggleSurligner() { this.applyStyle("surligne", this.couleurSurligneur); }

  applyStyle(style:string,value?:string){
    const selection=window.getSelection();
    if(!selection||selection.rangeCount===0) return;
    const range=selection.getRangeAt(0);
    if(range.collapsed) return;
    const span=document.createElement("span");

    switch(style){
      case'gras': span.style.fontWeight="bold"; break;
      case'italique': span.style.fontStyle="italic"; break;
      case'souligne': span.style.textDecoration="underline"; break;
      case'barre': span.style.textDecoration="line-through"; break;

      /* ========================= SURBRILLAGE ========================= */
      case 'surligne':
        switch (value) {
          case 'jaune': span.style.backgroundColor = "#ffff00"; span.style.color = "#000"; break;
          case 'vert': span.style.backgroundColor = "#90ee90"; span.style.color = "#000"; break;
          case 'bleu': span.style.backgroundColor = "#add8e6"; span.style.color = "#000"; break;
          case 'rose': span.style.backgroundColor = "#ffb6c1"; span.style.color = "#000"; break;
          case 'orange': span.style.backgroundColor = "#ffa500"; span.style.color = "#000"; break;
          case 'violet': span.style.backgroundColor = "#dda0dd"; span.style.color = "#000"; break;
          default: span.style.backgroundColor = "yellow"; span.style.color = "#000";
        }
        span.style.padding = "3px 5px";
        span.style.borderRadius = "5px";
        span.style.margin = "0.1rem";
        break;

      case'couleur': span.style.color = value || "red"; break;
    }

    try{
      range.surroundContents(span);
    }catch{
      const content=range.extractContents();
      span.appendChild(content);
      range.insertNode(span);
    }

    selection.removeAllRanges();
    selection.addRange(range);
  }

  /* ========================= RÉINITIALISER LA BARRE D'OUTILS ========================= */
  resetParametres() {
    this.texteTaille = 22;
    this.policeTexte = 'Arial';
    this.contrasteActif = false;
    this.grasActif = false;
    this.italiqueActif = false;
    this.soulignerActif = false;
    this.barrerActif = false;
    this.surlignerActif = false;
    this.couleurTexte = '#000000';
    this.couleurFond = '#ffffff';
    this.couleurSurligneur = '';

    localStorage.setItem('texteTaille', this.texteTaille.toString());
    localStorage.setItem('policeTexte', this.policeTexte);

    const contenu = document.querySelector('.user-highlight');
    if (contenu) {
      const spans = contenu.querySelectorAll('span');
      spans.forEach(span => {
        const parent = span.parentNode;
        while (span.firstChild) {
          parent?.insertBefore(span.firstChild, span);
        }
        parent?.removeChild(span);
      });
    }
  }

}
