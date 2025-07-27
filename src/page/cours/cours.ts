import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoursService } from '../../services/cours.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-cours',
  templateUrl: './cours.html',
  styleUrls: ['./cours.css'],
  standalone: true,
  imports: [CommonModule],
})
export class Cours implements OnInit {
  coursId!: string;
  cours: any;
  isLoading = true;
  pdfUrlSafe!: SafeResourceUrl;

  constructor(
    private route: ActivatedRoute,
    private coursService: CoursService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.coursId = this.route.snapshot.paramMap.get('id')!;
    this.coursService.getCoursById(this.coursId).subscribe({
      next: (data) => {
        this.cours = data;
        this.pdfUrlSafe = this.getSafePdfUrl();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur récupération cours:', err);
        this.isLoading = false;
      }
    });
  }

  getSafePdfUrl(): SafeResourceUrl {
    const pdfUrl = `http://localhost:3000/uploads/${this.cours.fichier}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl);
  }
}
