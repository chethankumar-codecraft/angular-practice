export interface HousingLocationInfo {
  id: number;
  name: string;
  city: string;
  state: string;
  photo: string;
  availableUnits: number;
  wifi: boolean;
  laundry: boolean;
  deleted: boolean;
}

export interface HousingCardView extends HousingLocationInfo {
  selected: boolean;
}

export type NewHousingLocation = Omit<HousingLocationInfo, 'id' | 'deleted'>;
