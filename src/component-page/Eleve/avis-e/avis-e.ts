import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvisService } from '../../../services/avis.service';
import { Avis } from '../../../model/avis';


@Component({
  selector: 'app-avis-e',
  imports: [CommonModule],
  templateUrl: './avis-e.html',
  styleUrls: ['./avis-e.css']
})
export class AvisE implements OnInit {
  avisList: Avis[] = [];

  constructor(private avisService: AvisService) {}

  ngOnInit(): void {
    this.avisService.getAvis().subscribe({
      next: (data) => this.avisList = data,
      error: (err) => console.error('Erreur récupération avis :', err)
    });
  }

  getInitiales(prenom: string): string {
    return prenom?.substring(0, 1).toUpperCase() ?? '';
  }
}
