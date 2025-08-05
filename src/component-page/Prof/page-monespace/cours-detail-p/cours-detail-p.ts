import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HeaderP } from "../../../../component/header-p/header-p";

@Component({
  selector: 'app-cours-detail-p',
  templateUrl: './cours-detail-p.html',
  styleUrls: ['./cours-detail-p.css'],
  standalone: true,
  imports: [CommonModule,HeaderP],
})
export class CoursDetailP implements OnInit {
  contenuHtml: SafeHtml | null = null;
  idCours: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.idCours = this.route.snapshot.paramMap.get('id');
    if (this.idCours) {
      this.http.get(`http://localhost:3000/api/cours/html/${this.idCours}`, { responseType: 'text' })
        .subscribe({
          next: (html) => {
            this.contenuHtml = this.sanitizer.bypassSecurityTrustHtml(html);
          },
          error: (err) => {
            console.error('Erreur lors du chargement du contenu HTML', err);
          }
        });
    }
  }
}
