import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-dernier-qcm',
  imports: [CommonModule,FormsModule],
  templateUrl: './dernier-qcm.html',
  styleUrl: './dernier-qcm.css'
})
export class DerniersQCM implements OnInit {

  derniersQcm: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.derniersQcm = [
      { titre: 'QCM Mathématiques - Niveau 3', score: 8, totalPoints: 10, date: '2025-08-12' },
      { titre: 'QCM Français - Niveau 2', score: 7, totalPoints: 10, date: '2025-08-10' },
      { titre: 'QCM Sciences - Niveau 1', score: 9, totalPoints: 10, date: '2025-08-08' }
    ];
  }

}