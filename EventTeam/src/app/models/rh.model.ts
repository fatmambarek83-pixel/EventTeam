export type ActivityStatus = 'Actif' | 'Planifié' | 'Terminé';
export type EventStatus = 'À venir' | 'Terminé';
export type ParticipationStatus = 'Accepté' | 'En attente' | 'Refusé';
export interface Activity {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  facilitator: string;
  status: ActivityStatus;
  imageUrl?: string;
}
export interface EventItem {
  id: string;
  name: string;
  description: string;
  date: string;
  location: string;
  maxCapacity: number;
  registeredCount: number;
  activityId: string;
  activityName?: string;
  status: EventStatus;
  imageUrl?: string;
}
export interface Participation {
  id: string;
  participantName: string;
  participantDepartment: string;
  avatarInitials: string;
  eventId: string;
  eventName: string;
  eventLocation: string;
  date: string;
  status: ParticipationStatus;
}
export interface Review {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  date: string;
}
export interface FeedbackEvent {
  id: string;
  eventId: string;
  eventName: string;
  eventDate: string;
  imageUrl?: string;
  reviews: Review[];
}
export interface PendingAccount {
  id: string;
  name: string;
  email: string;
  category: string;
  type: 'Employé' | 'Entreprise Ext.';
  avatarInitials: string;
}
export interface ExternalCompany {
  id: string;
  name: string;
  email: string;
  status: 'Accepté';
  avatarInitials: string;
}
export interface DashboardStats {
  totalEvents: number;
  totalEventsDelta: string;
  activeActivities: number;
  activeActivitiesTotal: number;
  totalParticipants: number;
  averageRating: number;
}
