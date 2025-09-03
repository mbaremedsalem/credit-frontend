export type NotificationType = {
  id: number;
  message: string;
  objet: string;
  date_created: string; 
  lu: boolean;
  user: {
    id: number;
    username: string;
    nom: string;
    prenom: string;
    post: string;
  };
};
