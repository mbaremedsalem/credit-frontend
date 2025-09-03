




export type Demande = {
    id:number|string,
    
}


export type AddLigne = {
    CLIENT: string;
    IDENTIFIENT: string;
    PAYSNAIS: string;
    DATNAIS: string;
    NOM: string;
    PRENOM: string;
    TEL: string;
    SEXE: string; 
    TYPE_DOCUMENT: string;
    NNI: string;
    AGENCE: string;
    TYPE_CLIENT : string,
    montant:number,
    duree:number,
    avis:string,
    memo:string,
    fichiers: {
    file: File;
    type_document: string;
    previewUrl?: string;
  }[];
    user_id : number,
    type_credit:string
    nature_credit?:string

}


export type AddCredit = {
    complement : File,
    id_credit : number|string
}