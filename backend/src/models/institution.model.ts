export interface Institution {
  id?: number;
  name: string;
  code: string;
  address?: string;
  phone?: string;
  email?: string;
  logo_url?: string;
  subscription_status?: string;
  created_at?: Date;
}
