export class DashboardData {
  totalBookings!: number;
  totalPeople!: number;
  totalMoney!: number;
}

export class TotalPeopleByMonth {
  month?: number;
  year?: number;
  totalPeople!: string;
}

export class TotalMoneyByMonth {
  month?: number;
  year?: number;
  totalMoney!: string;
}


export class PayTypeSumMonth {
  month?: number;
  year?: number;
  typesData?: { [key: string]: string };
}

export class PeopleByCity {
  month?: number;
  year?: number;
  cityData?: { [key: string]: string };
}

export interface AllByCity {
  month: number;
  year: number;
  AllData: {
    [city: string]: CityBookingData;
  };
}

export interface CityBookingData {
  totalBookings: string;
  totalPeople: string;
  totalMoney: string;
}
