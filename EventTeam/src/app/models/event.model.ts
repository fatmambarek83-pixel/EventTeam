export interface Event {
  id?: number;
  uuid?: string;
  name?: string;
  title?: string;
  startDate: string;
  endDate: string;
  category?: string;
  creator?: string;
  location?: string;
  status?: string;
  capacity?: number;
  participantsCount?: number;
  imageUrl?: string;
}
