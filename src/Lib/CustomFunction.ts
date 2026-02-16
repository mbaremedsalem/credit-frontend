



export function getDepartementUser(username:string){
    switch(username){
        case "Chargé de clientèle":
            return "Commercial"
        case "Chef agence central":
            return "Commercial"
        case "Directeur de département Islamique":
            return "Commercial"
        case "Chef de département commercial":
            return "Commercial"
        case "Directeur commercial":
            return "Commercial"

        case "Analyse de Risque":
            return "Risque"
        case "Directeur Risque":
            return "Risque"

        case "Directeur Engagement":
            return "Engagement"
        default:
            return ""
    }
}

export function GetEtatDossier(points_valides:number){
    switch(points_valides){
        case 0:
            return "Chargé de clientèle"
        case 2:
            return "Chef agence central"
        case 6:
            return "Directeur de département Islamique"
        case 12:
            return "Chef de département commercial"
        case 24:
            return "Directeur commercial"
        case 48:
            return "Analyse de Risque"
        case 96:
            return "Directeur Risque"
        
        

    }
}

export function GetAgenceBYcode(code:string){
    switch(code){
        case "00001":
            return "Nouakchott"
        case "00002":
            return "Nouadhibou"
        case "00003":
            return "Zoueratt"
        default:
            return 
    }
// export function getDepartementUser(username:string){
//     switch(username){
//         case "Chargé de clientèle":
//             return "Commercial"
//         case "Chef agence central":
//             return "Commercial"
//         case "Directeur de département Islamique":
//             return "Commercial"
//         case "Chef de département commercial":
//             return "Commercial"
//         case "Directeur commercial":
//             return "Commercial"

//         case "Analyse de Risque":
//             return "Risque"
//         case "Directeur Risque":
//             return "Risque"

//         case "Directeur Engagement":
//             return "Engagement"
//         default:
//             return ""
//     }
// }

export function GetEtatDossier(points_valides: number) {
  switch (points_valides) {
    case 0:
      return "Chargé de clientèle";
    case 2:
      return "Chef agence central";
    case 6:
      return "Chef de département commercial";
    case 12:
      return "Analyse de Risque";
    case 24:
      return "Commité de Crédit";
    case 48:
      return "Chargé de clientèle - Table d'amortissement";
    default:
      return "Directeur Engagement";
  }
}

export function getDepartementUser(points_valides: number) {
  switch (points_valides) {
    case 0:
      return "Commercial";
    case 2:
      return "Commercial";
    case 6:
      return "Commercial";
    case 12:
      return "Risque";
    case 24:
      return "Risque";
    case 48:
      return "Commercial";
    default:
      return "Engagement";
  }
}

export function GetAgenceBYcode(code: string) {
  switch (code) {
    case "00001":
      return "Nouakchott";
    case "00002":
      return "Nouadhibou";
    case "00003":
      return "Zoueratt";
    default:
      return;
  }
}






