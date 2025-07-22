import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard-a',
  templateUrl: './dashboard-a.html',
})
export class DashboardA implements OnInit {
  totalEleves = 0;
  totalProfs = 0;
  totalCours = 0;
  totalExercices = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getStats();
  }

  getStats() {
    this.http.get<any>('http://localhost:3000/api/stats/users').subscribe(data => {
      this.totalEleves = data.eleves;
      this.totalProfs = data.profs;
    });

    this.http.get<any>('http://localhost:3000/api/stats/cours').subscribe(data => {
      this.totalCours = data.totalCours;
    });

    this.http.get<any>('http://localhost:3000/api/stats/exercices').subscribe(data => {
      this.totalExercices = data.totalExercices;
    });
  }
}
