




export type ClientDetails = {
  id: number;
  client_code: string;
  identifiant: string;
  pays_naissance: string;
  date_naissance: string | null;
  nom: string;
  prenom: string;
  tel: string;
  sexe: string;
  type_document: string;
  date_expiration: string | null;
  date_creation: string | null;
  nni: string;
  agence: string;
  type_client: string;
  NIF: string;
  Address: string;
};

export type RachatType = {
  id: number;
  reference_rachat: string;
  client: number;
  client_details: ClientDetails;
  montant_rachat: string;
  montant_restant: number;
  institution_actuelle: string;
  type_credit: string;
  duree_restante_mois: number;
  nouvelle_duree_souhaitee: number | null;
  carte_identite_file: string;
  justificatif_domicile_file: string;
  bulletin_salaire_file: string | null;
  autre_document_file: string | null;
  createur: number;
  date_creation: string;
  date_modification: string;
  statut: string;
  notes: string;
};

export type RachatResponse = {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  results: RachatType[];
};




export type typeAddRachat = {
  createur_id: number;
  nom: string;
  prenom: string;
  tel: string;
  email: string;
  nni: string;
  adresse: string;
  montant_rachat: string;
  institution_actuelle: string;
  type_credit: string;
  duree_restante_mois: string;
  montant_restant?:string;

  carte_identite_file?: File;
  justificatif_domicile_file?: File;
  bulltin_salaire?: File;
  autre_document?: File;

};