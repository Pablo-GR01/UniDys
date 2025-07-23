import { Component, OnInit } from '@angular/core';
import { CoursService } from '../../../services/cours.service';
import { CoursUser} from '../../../model/';
import { UserService } from '../../../services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mes-cours-e',
  templateUrl: './mes-cours-e.html',
  styleUrls: ['./mes-cours-e.css'],
  imports:[FormsModule]
})
export class MesCoursE implements OnInit {
  cours: CoursUser[] = [];
  niveauFiltre: string = 'tous';
  utilisateurId: string = '';
  prenom: string = '';

  constructor(private coursService: CoursService, private userService: UserService) {}

  ngOnInit() {
    const utilisateur = this.userService.getUser();
    if (utilisateur) {
      this.utilisateurId = utilisateur._id;
      this.prenom = utilisateur.prenom;
      this.chargerCours();
    }
  }

  chargerCours() {
    this.coursService.getCoursParUtilisateur(this.utilisateurId).subscribe(data => {
      this.cours = data;
    });
  }

  coursFiltres(): CoursUser[] {
    if (this.niveauFiltre === 'tous') return this.cours;
    return this.cours.filter(c => c.niveau === this.niveauFiltre);
  }

  changerNiveau(niveau: string) {
    this.niveauFiltre = niveau;
  }
}
