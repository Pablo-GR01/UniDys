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

@Component({
  selector: 'app-level-e',
  templateUrl: './level-e.html',
  styleUrls: ['./level-e.css'],
  imports:[CommonModule]
})
export class LevelE implements OnInit, OnDestroy {
  user: User | null = null;
  palier: string = 'Débutant';
  progression: number = 0;
  xpRestant: number = 0;
  isLoading = true;
  errorMessage: string | null = null;

  private subscription: Subscription | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const email = localStorage.getItem('email');
    if (email) {
      // Timer qui déclenche toutes les 30 secondes
      this.subscription = timer(0, 30000).pipe(
        switchMap(() => this.getUserByEmail(email))
      ).subscribe({
        next: (user) => {
          if (user) {
            this.user = user;
            this.mettreAJourPalier();
            this.errorMessage = null;
          } else {
            this.errorMessage = 'Utilisateur introuvable.';
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de la récupération des données utilisateur.';
          this.isLoading = false;
          console.error(err);
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
    return this.http.get<User>(url).pipe(
      catchError((err) => {
        console.error('Erreur API:', err);
        return of(null);
      })
    );
  }

  private mettreAJourPalier(): void {
    if (!this.user || this.user.xp == null) {
      this.palier = 'Débutant';
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
  }

  private getXpMinForCurrentLevel(xp: number): number {
    if (xp < 100) return 0;
    if (xp < 300) return 100;
    if (xp < 600) return 300;
    return 600;
  }
}
