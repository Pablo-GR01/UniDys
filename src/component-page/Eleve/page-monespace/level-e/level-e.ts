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
  date: string;
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
  level: number = 0;
  progression: number = 0;
  xpRestant: number = 0;
  palier: string = 'Débutant';
  isLoading = true;
  errorMessage: string | null = null;
  private subscription: Subscription | null = null;

  derniersXp: QcmResult[] = [];

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
            if (user.xp == null) user.xp = 0;

            this.user = user;

            // ⚡ Affiche exactement l'XP de l'utilisateur connecté
            this.mettreAJourPalier(this.user.xp);

            // Récupérer les derniers XP si besoin
            this.getDerniersXp(email);

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

  private mettreAJourPalier(xp: number): void {
    const xpParLevel = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500, 6600, 7800, 9100, 10500];

    let lvl = 0;
    for (let i = 0; i < xpParLevel.length; i++) {
      if (xp >= xpParLevel[i]) lvl = i;
      else break;
    }
    this.level = lvl;

    const xpMin = xpParLevel[lvl];
    const xpMax = xpParLevel[lvl + 1] ?? xpMin + 100;

    this.progression = ((xp - xpMin) / (xpMax - xpMin)) * 100;
    this.xpRestant = Math.max(0, xpMax - xp);
  }

  ouvrirPopupDerniersXp(): void { this.showDerniersXp = true; }
  fermerPopupDerniersXp(): void { this.showDerniersXp = false; }

  get deuxDerniersXp(): QcmResult[] {
    return this.derniersXp.slice(0, 2);
  }
}
