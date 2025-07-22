import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UserService } from '../../services/user.service'; // Vérifie le chemin
import { Logo } from '../../component/logo/logo';
import { Icon } from '../../component/icon/icon';

interface ConnexionData {
  email: string;
  password: string;
  role: 'prof' | 'eleve' | 'admin'; // Ajout de admin ici
  codeProf?: string;
}

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule, Logo, Icon],
  templateUrl: './connexion.html',
})
export class Connexion implements OnInit, OnDestroy {
  actif: 'prof' | 'eleve' = 'eleve'; // Par défaut élève

  connexionData: ConnexionData = {
    email: '',
    password: '',
    role: 'eleve', // Par défaut élève
  };

  messageBienvenue: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy(): void {
    document.body.style.overflow = 'auto';
  }

  activerProf(): void {
    this.actif = 'prof';
    this.connexionData.role = 'prof';
  }

  activerEleve(): void {
    this.actif = 'eleve';
    this.connexionData.role = 'eleve';
  }

  formulaireValide(): boolean {
    const { email, password } = this.connexionData;
    return !!email && !!password;
  }

  valider(): void {
    console.log('Données de connexion envoyées:', this.connexionData);

    if (!this.formulaireValide()) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    const { email, password } = this.connexionData;

    // ✅ Sauter le backend pour l'admin
    if (email === 'admin@gmail.com' && password === 'admin') {
      this.userService.setUser({
        email: 'admin@gmail.com',
        role: 'admin',
        nom: 'Admin',
        prenom: '',
      });

      this.messageBienvenue = 'Bienvenue, administrateur !';

      setTimeout(() => {
        this.router.navigate(['/accueilA']); // redirection vers l'accueil admin
      }, 500);
      return;
    }

    // Sinon appel normal au serveur
    this.http
      .post<{
        nom?: string;
        prenom?: string;
        email: string;
        role: 'prof' | 'eleve' | 'admin';
      }>('http://localhost:3000/api/unidys/login', this.connexionData)
      .subscribe({
        next: (utilisateur) => {
          this.userService.setUser(utilisateur);

          this.messageBienvenue =
            utilisateur.role === 'admin'
              ? `Bienvenue, administrateur ${utilisateur.prenom || utilisateur.nom} !`
              : `Heureux de vous revoir, ${utilisateur.prenom || utilisateur.nom} !`;

          let redirection = '/accueilE'; // par défaut élève
          if (utilisateur.role === 'admin') redirection = '/accueilA';
          else if (utilisateur.role === 'prof') redirection = '/accueilP';

          setTimeout(() => {
            this.router.navigate([redirection]);
          }, 500);
        },
        error: (err) => {
          console.error('Erreur de connexion:', err);
          alert(err.error?.message || 'Email ou mot de passe incorrect.');
        },
      });
  }


}
