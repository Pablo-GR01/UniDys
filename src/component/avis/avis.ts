import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AvisDisplayService, Avis } from '../../services/avisService/avis-display.service';

@Component({
  selector: 'app-avis-e',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './avis.html',
  styleUrls: ['./avis.css'] // si tu veux ajouter du style
})
export class AvisE implements OnInit {
  avisList: Avis[] = [];
  loading = true;

  constructor(private avisService: AvisDisplayService) {}

  ngOnInit(): void {
    this.loadAvis();
  }

  loadAvis(): void {
    this.loading = true;
    this.avisService.getAvis().subscribe({
      next: (data) => {
        this.avisList = data.sort((a, b) => {
          const dateA = a.date ? new Date(a.date).getTime() : 0;
          const dateB = b.date ? new Date(b.date).getTime() : 0;
          return dateB - dateA;
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement avis', err);
        this.loading = false;
      }
    });
  }

  getInitiales(nom: string = '', prenom: string = ''): string {
    return (nom.charAt(0) || '') + (prenom.charAt(0) || '');
  }
}
