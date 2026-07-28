export interface Activity {
  id?: number;
  uuid?: string;
  event?: { id: number; name?: string; startDate?: string };
  name?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  animateur?: string;
  status?: string;
}
