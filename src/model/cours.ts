export interface Cours {
  _id: string;
  titre: string;
  niveau: string;
  matiere: string;
  nomProf: string;
  fichierPdf: string;
  lienYoutube?: string;
  imageUrl: string;
  pdfUrl?: string;
  qcms?: {
    question: string;
    reponses: string[];
    bonneReponse: number;
  }[];
}
