export interface Cours {
  _id: string;
  titre: string;
  matiere: string;
  niveau: string;
  fichierPdf: string;
  progression?: number; // ✅ champ ajouté pour suivi du progrès
}
