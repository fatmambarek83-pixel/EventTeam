export interface Feedback {
  id?: number;
  uuid?: string;
  eventId?: number;
  auteurId?: number;
  auteurName?: string;
  commentaire?: string;
  emoji?: string;
  stars: number;
}
