import { Component, NgModule, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-a',
  templateUrl: './dashboard-a.html',
  styleUrls: ['./dashboard-a.css'],
  imports:[CommonModule]
})
export class DashboardA implements OnInit {
  nombre = {
    eleve: 0,
    prof: 0,
    cours: 0,
    exercice: 0
  };

  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>('http://localhost:3000/api/unidys/dashboard/stats')
      .subscribe({
        next: (data) => {
          this.nombre = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Erreur lors du chargement des stats :', err);
          this.loading = false;
        }
      });
  }
}
