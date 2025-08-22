import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription, interval } from 'rxjs';

interface Eleve {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  xp: number;
  level: number; // 👈 calculé à partir de l'XP
}

@Component({
  selector: 'app-tableau',
  templateUrl: './tableau.html',
  styleUrls: ['./tableau.css'],
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule]
})
export class Tableau implements OnInit, OnDestroy {
  eleves: Eleve[] = [];

  // Countdown pour remise à zéro des XP
  countdown: any = { days: 0, hours: 0, minutes: 0, seconds: 0 };
  private timerSubscription!: Subscription;
  private targetDate: number = new Date().getTime() + 365 * 24 * 60 * 60 * 1000; // 1 an
  // 365 / 24 / 60 / 60 / 1000 / 1 an
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Récupération des élèves
    this.http.get<Eleve[]>('http://localhost:3000/api/eleves').subscribe({
      next: (data) => {
        this.eleves = data
          .map(e => ({ 
            ...e, 
            level: Math.floor(e.xp / 100) // calcul du level
          }))
          .sort((a, b) => b.xp - a.xp);
      },
      error: (err) => console.error('Erreur récupération des élèves', err)
    });

    // Lancement du compteur
    this.timerSubscription = interval(1000).subscribe(() => this.updateCountdown());
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) this.timerSubscription.unsubscribe();
  }

  private updateCountdown(): void {
    const now = new Date().getTime();
    const distance = this.targetDate - now;

    if (distance <= 0) {
      // Remise à zéro des XP
      this.eleves.forEach(eleve => eleve.xp = 0);
      this.eleves.forEach(eleve => eleve.level = 0);
      this.countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    } else {
      this.countdown.days = Math.floor(distance / (1000 * 60 * 60 * 24));
      this.countdown.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.countdown.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      this.countdown.seconds = Math.floor((distance % (1000 * 60)) / 1000);
    }
  }
}
