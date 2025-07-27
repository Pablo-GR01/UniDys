import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Avis } from '../../../model/avis';
import { AvisService } from '../../../services/avis.service';
@Component({
  selector: 'app-avis-e',
  standalone: true,
  templateUrl: './avis-e.html',
  imports:[CommonModule,HttpClientModule]
})
export class AvisComponent implements OnInit {

  avisList: Avis[] = [];

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

  getInitiales(nom: string, prenom: string): string {
    const initialNom = nom ? nom.charAt(0).toUpperCase() : '';
    const initialPrenom = prenom ? prenom.charAt(0).toUpperCase() : '';
    return initialNom + initialPrenom;
  }
}