import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './user.html',
  styleUrls: ['./user.css']
})
export class User implements OnInit {
  userCount: number = 0;
  courseCount: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Récupérer tous les utilisateurs
    this.http.get<any[]>('http://localhost:3000/api/unidys/users')
      .subscribe({
        next: users => this.userCount = Array.isArray(users) ? users.length : 0,
        error: err => console.error('Erreur API utilisateurs:', err)
      });

    // Récupérer tous les cours
    this.http.get<any[]>('http://localhost:3000/api/unidys/courses')
  .subscribe({
    next: courses => this.courseCount = Array.isArray(courses) ? courses.length : 0,
    error: err => console.error('Erreur API cours:', err)
  });

  }
}
