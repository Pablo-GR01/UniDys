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
    // ✅ Appel au controller User → getAllUsers
    this.http.get<any[]>('http://localhost:3000/api/unidys/users')
      .subscribe({
        next: users => {
          console.log("Réponse API Users:", users);
          this.userCount = Array.isArray(users) ? users.length : 0;
        },
        error: err => console.error('Erreur API utilisateurs:', err)
      });

    // ✅ Appel au controller Cours → getAllCourses
    this.http.get<any[]>('http://localhost:3000/api/unidys/cours')
      .subscribe({
        next: courses => {
          console.log("Réponse API Cours:", courses);
          this.courseCount = Array.isArray(courses) ? courses.length : 0;
        },
        error: err => console.error('Erreur API cours:', err)
      });
  }
}
