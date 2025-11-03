
export interface AddOn {
  name: string;
  price_bdt: number;
  notes: string;
  icon: string;
  time_hours?: number;
  time_days?: number;
}

export interface Service extends AddOn {
  add_ons?: AddOn[];
  allow_quantity?: boolean;
}

export interface ServiceData {
  pages: Service[];
  custom_code: Service[];
  extras: Service[];
}