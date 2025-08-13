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
  palier: string = 'Débutant';
  progression: number = 0;
  xpRestant: number = 0;
  level: number = 1;
  isLoading = true;
  errorMessage: string | null = null;
  private subscription: Subscription | null = null;

  derniersXp: QcmResult[] = [];

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

  private mettreAJourPalier(): void {
    if (!this.user || this.user.xp == null) {
      this.palier = 'Débutant';
      this.level = 1;
      this.progression = 0;
      this.xpRestant = 100;
      return;
    }

    const xp = this.user.xp;
    let xpMax = 100;

    if (xp < 100) {
      this.palier = 'Débutant';
      xpMax = 100;
    } else if (xp < 300) {
      this.palier = 'Intermédiaire';
      xpMax = 300;
    } else if (xp < 600) {
      this.palier = 'Avancé';
      xpMax = 600;
    } else {
      this.palier = 'Expert';
      xpMax = xp + 500;
    }

    const xpMin = this.getXpMinForCurrentLevel(xp);
    this.progression = ((xp - xpMin) / (xpMax - xpMin)) * 100;
    this.xpRestant = xpMax - xp;

    this.level = Math.floor(xp / 100) + 1;
  }

  private getXpMinForCurrentLevel(xp: number): number {
    if (xp < 100) return 0;
    if (xp < 300) return 100;
    if (xp < 600) return 300;
    return 600;
  }

  getImageForPalier(): string {
    switch (this.palier) {
      case 'Débutant': return 'assets/paliers/debutant.png';
      case 'Intermédiaire': return 'assets/paliers/intermediaire.png';
      case 'Avancé': return 'assets/paliers/avance.png';
      case 'Expert': return 'assets/paliers/expert.png';
      default: return 'assets/paliers/debutant.png';
    }
  }
}
