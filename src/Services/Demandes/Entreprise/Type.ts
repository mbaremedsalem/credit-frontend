


export type EnterpriseType = {
  CLIENT: string;
  Nature_de_compte: string;
  COMPTE: string;
  Agence: string;
  Raison_sociale: string;
  NIF: string;
  RC: string;
  Address: string;
  TEL: string;
};



export type AddCreditEntreprise = {
    CLIENT: string;
   
    NOM: string;

    TEL: string;
    
    NIF: string;
    Address : string

    AGENCE: string;
    nature_credit?:string
    montant:number,
    duree:number,
    avis:string,
    memo:string,
    fichiers: {
    file: File;
    type_document: string;
    previewUrl?: string;
  }[];
    user_id? : number,
    type_credit:string

}