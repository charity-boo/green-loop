export interface PickupHistoryItem {
  id: string;
  date: string;
  status: "Completed" | "Cancelled";
  weight: number;
  wasteType: string;
  points: number;
}

export interface UserMetrics {
  totalPickups: number;
  totalWeight: number;
  rewardPoints: number;
  lastPickup: string;
}

export interface WasteContribution {
  name: string;
  weight: number;
}
