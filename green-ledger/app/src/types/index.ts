export interface CarbonEntry {
    id?: number;
    activity: string;
    category: string;
    carbonAmount: number;
    location: string;
    latitude?: number;
    longitude?: number;
    timestamp: Date;
  }
  
  export interface CarbonSummary {
    totalCarbon: number;
    categoryBreakdown: Record<string, number>;
    monthlyData: MonthlyData[];
  }
  
  export interface MonthlyData {
    month: string;
    carbonAmount: number;
  }