export type ParticipationStatusLabel = 'Accepté' | 'En attente' | 'Refusé' | 'Annulé';

export interface Participation {
  id: number;
  employeId?: number;
  participantName?: string;
  participantDepartment?: string;
  avatarInitials?: string;
  eventId: number;
  eventName?: string;
  eventLocation?: string;
  date?: string;
  status: ParticipationStatusLabel;
}
