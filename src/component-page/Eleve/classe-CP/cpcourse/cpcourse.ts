import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CoursService } from '../../../../services/cours.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-cpcourse',
  standalone:true,
  templateUrl: './cpcourse.html',
  styleUrls: ['./cpcourse.css'],
  imports:[CommonModule, FormsModule,HttpClientModule]
})
export class CPCOURSE implements OnInit {
  matiereSelectionnee: string = 'Vue d\'ensemble';
  coursCP: any[] = [];
  coursFiltres: any[] = [];

  constructor(private coursService: CoursService, private router: Router) {}

  ngOnInit(): void {
    this.coursService.getCoursCP().subscribe((data: any[]) => {
      this.coursCP = data;
      this.filtrerCours(); // Initial affichage
    });
  }

  filtrerCours(): void {
    if (this.matiereSelectionnee === 'Vue d\'ensemble') {
      const uniqueMatières = ['Français', 'Maths', 'Histoire'];
      this.coursFiltres = uniqueMatières.map(matiere =>
        this.coursCP.find(cours => cours.matiere === matiere)
      ).filter(Boolean);
    } else {
      this.coursFiltres = this.coursCP.filter(cours => cours.matiere === this.matiereSelectionnee);
    }
  }

  changerMatiere(matiere: string): void {
    this.matiereSelectionnee = matiere;
    this.filtrerCours();
  }

  voirDetailsCours(coursId: string): void {
    this.router.navigate(['/cours', coursId]); // Navigue vers une page dédiée
  }
}
