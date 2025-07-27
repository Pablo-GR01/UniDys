import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

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

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.nomProf = 'Javier Garcia'; // test direct
  
    this.http.get<any[]>(`http://localhost:3000/api/cours/prof/${encodeURIComponent(this.nomProf)}`)
      .subscribe({
        next: data => {
          this.cours = data;
          console.log('Cours chargés:', this.cours);
        },
        error: err => {
          console.error('Erreur récupération cours:', err);
        }
      });
  }

  getImageParMatiere(matiere: string): string {
    const lower = matiere.toLowerCase();
    if (lower.includes('français')) {
      return 'assets/francais.png';
    }
    if (lower.includes('math') || lower.includes('maths')) {
      return 'assets/maths.png';
    }
    if (lower.includes('histoire')) {
      return 'assets/images/histoire.png';
    }
    if (lower.includes('svt')) {
      return 'assets/svt.png';
    }
    if (lower.includes('anglais')) {
      return 'assets/anglais.png';
    }
    // Par défaut
    return 'assets/cours-default.png';
  }
  
  
}
