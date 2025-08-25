import { Component, OnInit } from '@angular/core';
import { AvisService, Avis } from '../../services/avis.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-avis',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './avis.html',
  styleUrls: ['./avis.css']
})
export class AvisComponent implements OnInit {
  avisList: Avis[] = [];

  constructor(private avisService: AvisService) {}

  ngOnInit() {
    this.avisService.getAvis().subscribe({
      next: (data) => this.avisList = data,
      error: (err) => console.error('Erreur chargement avis :', err)
    });
  }
}
