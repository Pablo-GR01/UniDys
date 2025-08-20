import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'; // <-- Ajouté ici
import { AvisDisplayService, Avis } from '../../services/avisService/avis-display.service';

@Component({
  selector: 'app-avis',
  standalone: true,
  imports: [CommonModule, HttpClientModule], // <-- Ajouté ici
  templateUrl: './avis.html',
  styleUrls: ['./avis.css']
})
export class AvisComponent implements OnInit {
  avisList: Avis[] = [];

  constructor(private avisService: AvisDisplayService) {}

  ngOnInit(): void {
    this.avisService.getAvis().subscribe({
      next: (data) => {
        console.log('Données reçues depuis API :', data);
        this.avisList = data;
      },
      error: (err) => console.error('Erreur API :', err)
    });
  }
}
