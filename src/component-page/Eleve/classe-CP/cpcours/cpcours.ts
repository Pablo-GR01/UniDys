import { Component, OnInit } from '@angular/core';
import { CoursService } from '../../../../services/cours.service';
import { Cours } from '../../../../model/cours';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cpcours',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './cpcours.html',
  styleUrl: './cpcours.css'
})
export class CPCours implements OnInit {
  cours: Cours[] = [];
  niveau = 'CP'; // Fixé ici pour ton besoin
  matiereActive = 'Français';
  matieres = ['Français', 'Maths', 'Questionner le Monde'];

  constructor(private coursService: CoursService) {}

  ngOnInit() {
    this.chargerCours();
  }

  changerMatiere(matiere: string) {
    this.matiereActive = matiere;
    this.chargerCours();
  }

  chargerCours() {
    this.coursService.getCoursParNiveauEtMatiere(this.niveau, this.matiereActive).subscribe((data) => {
      this.cours = data;
    });
  }
}