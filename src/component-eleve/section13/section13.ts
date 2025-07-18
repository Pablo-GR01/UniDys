import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-section13',
  templateUrl: './section13.html',
  styleUrls: ['./section13.css']
})
export class Section13 implements OnInit {
  welcomeMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;

    this.http.get<{ firstName: string; lastName: string; role: string }>('http://localhost:3000/api/user', { headers })
      .subscribe({
        next: (data) => {
          if (data.role === 'prof') {
            this.welcomeMessage = `Bonjour Mr ${data.lastName} ${data.firstName}`;
          } else {
            this.welcomeMessage = `Bonjour ${data.firstName} ${data.lastName}`;
          }
        },
        error: (err) => {
          console.error('Erreur chargement user:', err.status, err.message, err.error);
          this.welcomeMessage = 'Erreur lors du chargement du profil';
        }
      });
  }
}
