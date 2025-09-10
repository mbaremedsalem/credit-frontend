


export type Client = {
    id: number;
    client : string,
    nom : string,
    agence : string,
    datouv : string,
    typ:string,
    posval:string,
    posdisp:string,
    devise:string,
    mntdev:string,
    valide:string,
    ncggr:string,
    sumglob:string,
}

export type CLientT ={  
  Nature_de_compte?:string,
  COMPTE?:string,
  CLIENT: string;
  IDENTIFIENT: string;
  PAYSNAIS: string;
  DATNAIS: string;
  NOM: string;
  PRENOM: string;
  TEL: string;
  SEXE: string
  TYPE_DOCUMENT: string;
  NNI: string;
  AGENCE: string;
  SOLDE_VALABLE: number;
  SOLDE_DISPONIBLE: number,
  TYPE_CLIENT : string}
export type NewClient = {
   count : number,
   next:string,
   previous : string,
   results : CLientT[]

  };
  

export type LigneCredit = {
    id: string;
    client: {
        client_code: string;
          identifiant: string;
          pays_naissance: string;
          date_naissance: string; 
          nom: string;
          prenom: string;
          tel: string;
          sexe: string;
          type_document: string;
          date_expiration: string; 
          nni: string;
          date_creation: string; 
          agence: string;
          type_client: string;
          credits: {
            montant: string; 
            duree: number;
          }[];
          NIF:string, 
          Address : string
        };
        documents: {
          fichier: string;
          type_document:string;
          id:string;
          createur: {
            id:string,
            username:string,
            nom:string, 
            prenom:string,
            post:string
          },
          date_creation : string

        }[];
        montant: string;
        duree: number;
        avis: string;
        memo: string;
        date_demande: string; 
        reference: string;
        status: string;
        points_valides?:number,
        motif_rejet?:string,
        date_rejet?:string, 
        agence?:string,
        type_credit:string,
        nature_credit?:string,
        type_dossier?:string
};
      




export type CreditData = {
    credit: {
      id: number;
      client: {
        client_code: string;
        identifiant: string;
        pays_naissance: string;
        date_naissance: string; 
        nom: string;
        prenom: string;
        tel: string;
        sexe: string;
        type_document: string;
        date_expiration: string;
        nni: string;
        date_creation: string;
        agence: string;
        type_client: string;
        credits: {
          montant: string;
          duree: number;
        }[];
      };
      montant: string;
      duree: number;
      avis: string;
      memo: string;
      date_demande : string;
      reference: string;
      status: string;
      points_valides: number;
      motif_rejet : string,
      date_rejet:string
      agence:string
    };
    validations: {
      validateur: {
        id: number;
        username: string;
        nom: string;
        prenom: string;
        post: string;
      };
      poste: string;
      points: number;
      date_validation: string;
      motiv:string,
      memo : string, 
      status:string,
      date_rejet:string,
      date_creation:string
    }[];
  };
  





export type DemandeCredit = {

  id: number,
  complement:string,
  status : string,
  reference: string,
  date_envoi: string,
  credit: {
    id: number,
    client: {
        client_code: string,
        identifiant: string,
        pays_naissance: string,
        date_naissance: string,
        nom: string,
        prenom: string,
        tel: string,
        sexe: string,
        type_document: string,
        date_expiration:string,
        nni: string,
        date_creation: string,
        agence: string,
        type_client: string,
        credits: [
              {
                montant: string,
                duree: number
              }
          ]
      },
      documents: {
        fichier: string;
      }[];
      montant: string,
      duree: string,
      avis: string,
      memo: string,
      date_demande: string,
      reference: string,
      status: string,
      points_valides: number,
      motif_rejet: string,
      date_rejet: string,
      
  }
}






export type CreditValid = {
  id: number;
  complement: string;
  status: string;
  reference: string;
  date_envoi: string;
  date_validation:string;
  date_rejet : string;
  points_valides : number;
  credit: {
    id: number;
    client: {
      client_code: string;
      identifiant: string;
      pays_naissance: string;
      date_naissance: string;
      nom: string;
      prenom: string;
      tel: string | null;
      sexe: string;
      type_document: string;
      date_expiration: string;
      nni: string;
      date_creation: string;
      agence: string;
      type_client: string;
      credits: {
        montant: string;
        duree: number;
      }[];
    };
    documents: {
      fichier: string;
    }[];
    montant: string;
    duree: number;
    avis: string;
    memo: string;
    date_demande: string;
    reference: string;
    status: string;
    points_valides: number;
    motif_rejet: string | null;
    date_rejet: string | null;
    agence:string;
    type_credit:string;
  };
};



export type CreditHistorique = {
  id: number;
  demandecredit: {
    id: number;
    credit: {
      id: number;
      client: {
        client_code: string;
        identifiant: string;
        pays_naissance: string;
        date_naissance: string;
        nom: string;
        prenom: string;
        tel: string;
        sexe: string;
        type_document: string;
        date_expiration: string;
        nni: string;
        date_creation: string;
        agence: string;
        type_client: string;
        credits: {
          montant: string;
          duree: number;
        }[];
      };
      montant: string;
      duree: number;
      avis: string;
      memo: string;
      date_demande: string;
      reference: string;
      status: string;
      points_valides: number;
      motif_rejet: string | null;
      date_rejet: string | null;
      agence : string | null;
    };
    reference: string;
    date_envoi: string;
    status: string;
    date_validation: string | null;
    date_rejet: string;
    complement: string;
    points_valides: number;
    motif_rejet : string
  };
  validations: {
    validateur: {
      id: number;
      username: string;
      nom: string;
      prenom: string;
      post: string;
    };
    poste: string;
    points: number;
    date_validation: string;
    motiv:string;
    memo:string
  }[];
};





export type ArchiveLigne = {
  id: number;
  credit: {
    id: number;
    client: {
      client_code: string;
      identifiant: string;
      pays_naissance: string;
      date_naissance: string;
      nom: string;
      prenom: string;
      tel: string;
      sexe: string;
      type_document: string;
      date_expiration: string;
      nni: string;
      date_creation: string;
      agence: string;
      type_client: string;
      credits: {
        montant: string;
        duree: number;
      }[];
    };
    montant: string;
    duree: number;
    avis: string;
    memo: string;
    date_demande: string;
    reference: string;
    status: string;
    points_valides: number;
    motif_rejet: string | null;
    date_rejet: string | null;
  };
  demandecredit: {
    id: number;
    credit: {
      id: number;
      client: {
        client_code: string;
        identifiant: string;
        pays_naissance: string;
        date_naissance: string;
        nom: string;
        prenom: string;
        tel: string;
        sexe: string;
        type_document: string;
        date_expiration: string;
        nni: string;
        date_creation: string;
        agence: string;
        type_client: string;
        credits: {
          montant: string;
          duree: number;
        }[];
      };
      montant: string;
      duree: number;
      avis: string;
      memo: string;
      date_demande: string;
      reference: string;
      status: string;
      points_valides: number;
      motif_rejet: string | null;
      date_rejet: string | null;
    };
    reference: string;
    date_envoi: string;
    status: string;
    date_validation: string;
    date_rejet: string | null;
    complement: string | null;
    points_valides: number;
  };
  reference: string;
  date_envoi: string;
};



