import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subscription, timer } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

interface User {
  xp: number;
  prenom?: string;
  nom?: string;
}

interface QcmResult {
  xpGagne: number;
  date: string; // ou timestamp
}

@Component({
  selector: 'app-level-e',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './level-e.html',
  styleUrls: ['./level-e.css']
})
export class LevelE implements OnInit, OnDestroy {
  user: User | null = null;
  level: number = 1;
  progression: number = 0;
  xpRestant: number = 0;
  palier: string = 'Débutant';
  isLoading = true;
  errorMessage: string | null = null;
  private subscription: Subscription | null = null;

  derniersXp: QcmResult[] = [];
  totalXp: number = 0; // nouvelle propriété pour le total des XP

  showDerniersXp: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const email = localStorage.getItem('email');
    if (email) {
      this.subscription = timer(0, 30000).pipe(
        switchMap(() => this.getUserByEmail(email))
      ).subscribe({
        next: (user) => {
          if (user) {
            this.user = user;
            this.mettreAJourPalier();
            this.getDerniersXp(email);
            this.calculerTotalXp(email); // <-- récupère le total
            this.errorMessage = null;
          } else {
            this.errorMessage = 'Utilisateur introuvable.';
          }
          this.isLoading = false;
        },
        error: () => {
          this.errorMessage = 'Erreur lors de la récupération des données utilisateur.';
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
      this.errorMessage = 'Utilisateur non connecté.';
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private getUserByEmail(email: string): Observable<User | null> {
    const url = `http://localhost:3000/api/unidys/users/${email}`;
    return this.http.get<User>(url).pipe(catchError(() => of(null)));
  }

  private getDerniersXp(email: string): void {
    const url = `http://localhost:3000/api/unidys/qcmresults/${email}`;
    this.http.get<QcmResult[]>(url).pipe(
      catchError(() => of([]))
    ).subscribe(results => {
      this.derniersXp = results
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);
    });
  }

  // Nouvelle méthode pour calculer le total des XP
  private calculerTotalXp(email: string): void {
    const url = `http://localhost:3000/api/unidys/qcmresults/${email}`;
    this.http.get<QcmResult[]>(url).pipe(
      catchError(() => of([]))
    ).subscribe(results => {
      this.totalXp = results
        .filter(r => r && r.xpGagne)
        .reduce((acc, r) => acc + r.xpGagne, 0);
    });
  }

  private mettreAJourPalier(): void {
    if (!this.user || this.user.xp == null) {
      this.level = 0;
      this.progression = 0;
      this.xpRestant = 100;
      return;
    }
  
    const xp = this.user.xp;
  
    // Tableau cumulatif XP par level (exemple : level 0 → 0, level 1 → 100, level 2 → 300, etc.)
    const xpParLevel = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500, 6600, 7800, 9100, 10500];
  
    // Trouver le level actuel
    let lvl = 0;
    for (let i = 0; i < xpParLevel.length; i++) {
      if (xp >= xpParLevel[i]) {
        lvl = i;
      } else {
        break;
      }
    }
    this.level = lvl;
  
    // XP pour le level actuel
    const xpMin = xpParLevel[lvl];
    const xpMax = xpParLevel[lvl + 1] ?? xpMin + 100; // Si pas défini, ajouter 100 par défaut
  
    // Progression et XP restant
    this.progression = ((xp - xpMin) / (xpMax - xpMin)) * 100;
    this.xpRestant = xpMax - xp;
  }
  

  private getXpMinForCurrentLevel(xp: number): number {
    if (xp < 100) return 0;
    if (xp < 300) return 100;
    if (xp < 600) return 300;
    return 600;
  }

  // Popup méthodes
  ouvrirPopupDerniersXp(): void { this.showDerniersXp = true; }
  fermerPopupDerniersXp(): void { this.showDerniersXp = false; }

  get deuxDerniersXp(): QcmResult[] { return this.derniersXp.slice(0, 2); }
}

