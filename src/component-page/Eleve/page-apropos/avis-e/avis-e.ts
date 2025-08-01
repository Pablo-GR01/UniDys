import { Component, OnInit } from '@angular/core';
import { Avis, AvisService } from '../../../../services/avis.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-avis-e',
  templateUrl: './avis-e.html',
  standalone:true,
  imports:[FormsModule,CommonModule,HttpClientModule]
})
export class AvisE implements OnInit {
  avisList: Avis[] = [];

  nouvelAvis: Partial<Avis> = {
    nom: '',
    prenom: '',
    message: ''
  };

  constructor(private avisService: AvisService) {}

  ngOnInit(): void {
    this.loadAvis();
  }

  loadAvis(): void {
    this.avisService.getAvis().subscribe({
      next: (data) => this.avisList = data,
      error: (err) => console.error('Erreur chargement avis', err)
    });
  }

  soumettreAvis(): void {
    const { nom, prenom, message } = this.nouvelAvis;

    if (nom?.trim() && prenom?.trim() && message?.trim()) {
      this.avisService.postAvis({ nom, prenom, message }).subscribe({
        next: () => {
          this.loadAvis();
          this.nouvelAvis = { nom: '', prenom: '', message: '' };
        },
        error: (err) => console.error('Erreur envoi avis', err)
      });
    } else {
      console.warn('Tous les champs doivent être remplis.');
    }
  }

  getInitiales(nom: string, prenom: string): string {
    const initialNom = nom ? nom.charAt(0).toUpperCase() : '';
    const initialPrenom = prenom ? prenom.charAt(0).toUpperCase() : '';
    return initialNom + initialPrenom;
  }
}
