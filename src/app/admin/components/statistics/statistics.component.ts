import { Component, OnInit } from '@angular/core';
import { StatisticService } from 'src/app/admin/services/statistic.service';
import Chart, { ChartType } from 'chart.js/auto';
import { DashboardData, PayTypeSumMonth, PeopleByCity, AllByCity, CityBookingData } from 'src/app/admin/models/statistic.model';


@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  // DashBoard Data
  totalBookings: number = 0;
  totalPeople: number = 0;
  totalMoney: number = 0;
  selectedPeriodPeople: string = '6 months';
  chartOneTotPeople: any = {};
  selectedPeriodMoney: string = '6 months';
  chartOneTotMoney: any = {};
  selectedPeriodTypes: string = '6 months';
  chartOneTypePayment: any = {};
  // OVO SU PARAMETRI ZA TOTAL PEOPLE BY CITY
  selectedPeriodPplCity: string = '6 months';
  chartOnePeopleCity: any = {};
  // OVO SU PARAMETRI ZA INFO BOOKINGS
  selectedInfoCity: string = 'Belgrade';
  selectedPeriodInfoBkng: string = '6 months';


  nizZaGrad: any = [];

  constructor(private statisticService: StatisticService) {}

  ngOnInit(): void {
    this.fetchAndRenderDashboardData();
    this.fetchAndRenderPeopleData();
    this.fetchAndRenderMoneyData();
    this.fetchAndRenderPayType();
    this.fetchAndRenderPeopleCityData();
    this.fetchAndRenderInfoBkngCity();
  }

  fetchAndRenderDashboardData() {
    this.statisticService.fetchDashBoard()
      .subscribe((dashboardData: DashboardData) => {
        this.totalBookings = dashboardData.totalBookings;
        this.totalPeople = dashboardData.totalPeople;
        let moneySplit = dashboardData.totalMoney / 1000;
        this.totalMoney = parseFloat(moneySplit.toFixed(1));
      });
  }
  // ===========================================================================
  // ======================== TOTAL PEOPLE BY MONTH ============================
  // ===========================================================================
  fetchAndRenderPeopleData() {
    this.statisticService.fetchPeopleByMonth()
      .subscribe((peopleData) => {
        const monthlyPeopleDataArray = this.generateMonthsUntilNow(peopleData);
        const filteredPeopleData = this.filterTotalPeople(monthlyPeopleDataArray);
        const chartOneTotPeople = this.preparePeopleChartData(filteredPeopleData);
        this.renderChart(chartOneTotPeople, 'myPeopleChart', 'bar');
      });
  }
  // ===========================================================================
  // ======================== TOTAL PEOPLE BY MONTH ============================
  // ===========================================================================
  fetchAndRenderMoneyData() {
    this.statisticService.fetchMoneyByMonth()
      .subscribe((moneyData) => {
        const monthlyMoneyDataArray = this.generateMonthsUntilNow(moneyData);
        const filteredMoneyData = this.filterTotalMoney(monthlyMoneyDataArray);
        const chartOneTotMoney = this.prepareMoneyChartData(filteredMoneyData);
        this.renderChart(chartOneTotMoney, 'myMoneyChart', 'bar');
      });
  }
  generateMonthsUntilNow<T extends { month: number; year: number; totalPeople?: string; totalMoney?: string; }>(data: T[]): T[] {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const months: T[] = [];
    let monthsUntil2023 = 0;
    let date = new Date(currentYear, currentMonth);
    while (date.getFullYear() > 2023 || (date.getFullYear() === 2023 && date.getMonth() > 0)) {
      monthsUntil2023++;
      date.setMonth(date.getMonth() - 1);
    }
    for (let i = 0; i < monthsUntil2023; i++) {
      date.setMonth(date.getMonth() + 1);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const foundItem = data.find(item => item.month === month && item.year === year);
      const newItem = { month, year, totalPeople: foundItem?.totalPeople || '0', totalMoney: foundItem?.totalMoney || '0' } as T;
      months.push(newItem);
    }
    return months.reverse() as T[];
  }
  filterTotalMoney<T>(data: T[]): T[] {
    if (this.selectedPeriodMoney === 'All') {
      return data;
    }
    let monthsToShow = 0;
    switch (this.selectedPeriodMoney) {
      case '6 months':
        monthsToShow = 6;
        break;
      case '1 year':
        monthsToShow = 12;
        break;
      case '2 years':
        monthsToShow = 24;
        break;
      default:
        break;
    }
    const filteredData = data.slice(0, monthsToShow);
    return filteredData;
  }

  filterTotalPeople<T>(data: T[]): T[] {
    if (this.selectedPeriodPeople === 'All') {
      return data;
    }
    let monthsToShow = 0;
    switch (this.selectedPeriodPeople) {
      case '6 months':
        monthsToShow = 6;
        break;
      case '1 year':
        monthsToShow = 12;
        break;
      case '2 years':
        monthsToShow = 24;
        break;
      default:
        break;
    }
    const filteredData = data.slice(0, monthsToShow);
    return filteredData;
  }

  preparePeopleChartData(data: any[]): any {
    const labels: string[] = [];
    const total: string[] = [];
    data.forEach(item => {
      labels.push(`${item.month}-${item.year}`);
      total.push(item.totalPeople);
    });
    return {
      labels: labels,
      datasets: [{ label: 'People', data: total, borderWidth: 1, backgroundColor: 'rgba(194, 54, 71, 1)', hoverBackgroundColor: 'rgba(163, 39, 54, 0.9)' }]};
  }
  prepareMoneyChartData(data: any[]): any {
    const labels: string[] = [];
    const total: string[] = [];
    data.forEach(item => {
      labels.push(`${item.month}-${item.year}`);
      total.push(item.totalMoney);
    });
    return {
      labels: labels,
      datasets: [{ label: 'Money', data: total, borderWidth: 1, backgroundColor: 'rgba(194, 54, 71, 1)', hoverBackgroundColor: 'rgba(163, 39, 54, 0.9)' }]};
  }
  // ===========================================================================
  // ===================== PAYMENT TYPE SUM BY MONTHS ==========================
  // ===========================================================================
  fetchAndRenderPayType() {
    this.statisticService.fetchSumPayTypeMonthly()
      .subscribe((paymentData: PayTypeSumMonth[]) => {
        if (paymentData.length === 0) {
          return;
        }
        const formattedPaymentData = paymentData.map(item => {
          return {
            month: item.month || 0,
            year: item.year || 0,
            typesData: item.typesData || {}
          };
        });
        const filteredPaymentData = this.filterTotalPayType(formattedPaymentData);
        const monthlyPaymentDataArray = this.generateMonthsTypePay(filteredPaymentData);
        const chartOneTypePayment = this.preparePaymentTypeChartData(monthlyPaymentDataArray);
        this.renderChart(chartOneTypePayment, 'myPaymentChart','line');
      });
  }
  generateMonthsTypePay<T extends { month: number; year: number; typesData?: any }>(data: T[]): T[] {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const months: T[] = [];
    const paymentTypesSet = new Set<string>();
    data.forEach(item => {
      for (const key in item.typesData) {
        if (Object.prototype.hasOwnProperty.call(item.typesData, key)) {
          paymentTypesSet.add(key);
        }
      }
    });
    const paymentTypes = Array.from(paymentTypesSet);
    for (let year = 2023; year <= currentYear; year++) {
      const maxMonth = (year === currentYear) ? currentMonth : 12;
      for (let month = 1; month <= maxMonth; month++) {
        const foundItem = data.find(item => item.month === month && item.year === year);
        const typesData: any = {};
        paymentTypes.forEach(type => {
          typesData[type] = foundItem ? foundItem.typesData[type] || '0' : '0';
        });
        const newItem = { month, year, typesData } as T;
        months.push(newItem);
      }
    }
    return months.reverse();
  }
  filterTotalPayType<T extends { year: number; month: number; }>(data: T[]): T[] {
    if (this.selectedPeriodTypes === 'All') {
      const allMonths = this.generateMonthsTypePay(data);
      return allMonths;
    }
    let monthsToShow = 0;
    switch (this.selectedPeriodTypes) {
      case '6 months':
        monthsToShow = 6;
        break;
      case '1 year':
        monthsToShow = 12;
        break;
      case '2 years':
        monthsToShow = 24;
        break;
      default:
        break;
    }
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const allMonths = this.generateMonthsTypePay(data);
    const filteredData = allMonths.slice(0, monthsToShow);
    return filteredData;
  }
  preparePaymentTypeChartData(data: any[]): any {
    const labels: string[] = [];
    const datasets: any[] = [];
    if (this.selectedPeriodTypes === 'All') {
        data.forEach(item => {
            const monthYear = `${item.month}-${item.year}`;
            if (!labels.includes(monthYear)) {
                labels.push(monthYear);
            }
        });
    } else {
        const filteredData = this.filterTotalPayType(data);
        filteredData.forEach(item => {
            const monthYear = `${item.month}-${item.year}`;
            labels.push(monthYear);
        });
    }
    const paymentTypesSet = new Set<string>();
    data.forEach(item => {
        for (const key in item.typesData) {
            if (Object.prototype.hasOwnProperty.call(item.typesData, key)) {
                paymentTypesSet.add(key);
            }
        }
    });
    const paymentTypes = Array.from(paymentTypesSet);
    // ========================== SETTINGS COLORS FOR DATASET 5 ===========================
    const colors = ['rgb(48, 166, 99)', 'rgb(194, 54, 71)', 'rgb(166, 79, 48)', 'rgb(42,150,218)', 'rgb(48, 53, 217)'];
    let index = 0;
    paymentTypes.forEach((type, index) => {
        const typeData: any = { label: type, data: [], borderWidth: 2, cubicInterpolationMode: 'monotone', borderColor: colors[index], color: colors[index], pointBackgroundColor: colors[index], pointHoverBackgroundColor: colors[index] };
        labels.forEach(monthYear => {
            const monthData = data.find(item => `${item.month}-${item.year}` === monthYear);
            typeData.data.push(monthData ? monthData.typesData[type] || 0 : 0);
        });
        datasets.push(typeData);
    });
    return {
        labels: labels,
        datasets: datasets
    };
  }
  // ===========================================================================
  // ======================== Total People By City =============================
  // ===========================================================================
  fetchAndRenderPeopleCityData() {
    this.statisticService.fetchPeopleCity()
      .subscribe((peopleCityData: PeopleByCity[]) => {
        const monthlyPeopleCityDataArray = this.generateMonthsPeopleCity(peopleCityData);
        const filteredPeopleCityData = this.filterTotalPeopleCity(monthlyPeopleCityDataArray);
        const chartOnePeopleCity = this.preparePeopleCityChartData(filteredPeopleCityData);
        this.renderChart(chartOnePeopleCity, 'myPeopleCityChart', 'line');
      });
  }
  generateMonthsPeopleCity<T extends PeopleByCity>(data: T[]): T[] {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const months: T[] = [];
    for (let year = 2023; year <= currentYear; year++) {
      const maxMonth = (year === currentYear) ? currentMonth : 12;
      for (let month = 1; month <= maxMonth; month++) {
        const foundItem = data.find(item => item.month === month && item.year === year);
        const cityData: { [key: string]: string } = {};
        if (foundItem) {
          Object.assign(cityData, foundItem.cityData);
        } else {
          const cities = ['Belgrade', 'Lisabon', 'Budva', 'Barcelona'];
          cities.forEach(city => {
            cityData[city] = '0';
          });
        }
        const newItem = { month, year, cityData } as T;
        months.push(newItem);
      }
    }
    return months.reverse();
  }
  filterTotalPeopleCity<T>(data: T[]): T[] {
    let monthsToShow = 0;
    switch (this.selectedPeriodPplCity) {
      case '6 months':
        monthsToShow = 6;
        break;
      case '1 year':
        monthsToShow = 12;
        break;
      case '2 years':
        monthsToShow = 24;
        break;
      default:
        break;
    }
    const filteredData = data.slice(0, monthsToShow);
    return filteredData;
  }
  preparePeopleCityChartData(data: any[]): any {
    const labels: string[] = [];
    const cities: string[] = [];
    const cityData: { [key: string]: string[] } = {};
    data.forEach(item => {
      labels.push(`${item.month}-${item.year}`);
      for (const city in item.cityData) {
        if (!cities.includes(city)) {
          cities.push(city);
          cityData[city] = [];
        }
        cityData[city].push(item.cityData[city]);
      }
    });
    // ========================== SETTINGS COLORS FOR DATASET 4 CITIES ===========================
    const colors = ['rgb(194, 54, 71)', 'rgb(166, 79, 48)', 'rgb(48, 166, 99)', 'rgb(42,150,218)'];
    let index = 0;
    const datasets: any[] = [];
    cities.forEach((city, index) => {
      datasets.push({ label: city, data: cityData[city], borderWidth: 2, cubicInterpolationMode: 'monotone', borderColor: colors[index], color: colors[index], pointBackgroundColor: colors[index], pointHoverBackgroundColor: colors[index] });
    });
    return {
      labels: labels,
      datasets: datasets
    };
  }
  // ===========================================================================
  // ============== Total Bookings People Money By City ========================
  // ===========================================================================
  fetchAndRenderInfoBkngCity() {
    this.statisticService.fetchAllByCity()
      .subscribe((data: AllByCity[]) => {
        const filteredData = this.filterTotalInfoBkng(data);
        const chartData = this.prepareInfoBkngCityChartData(filteredData);
        if (chartData) {
            this.renderChart(chartData, 'myTotalInfoBookings', 'line');
        }
      });
  }
  filterTotalInfoBkng(data: AllByCity[]): AllByCity[] {
    const filteredByPeriod = this.filterAllByMonths(data);
    const monthsToShow = this.getMonthsToShow();
    const filteredByPeriodAndCity = this.filterByPeriod(filteredByPeriod, monthsToShow);
    const filteredByCity = this.filterBySelectedCity(filteredByPeriodAndCity);
    return filteredByCity;
  }
  filterByPeriod(data: AllByCity[], monthsToShow: number): AllByCity[] {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const startIndex = data.findIndex(item => item.year === currentYear && item.month === currentMonth);
    const endIndex = startIndex + monthsToShow - 1;
    return data.slice(startIndex < 0 ? 0 : startIndex, endIndex + 1);
  }
  filterAllByMonths<T extends AllByCity & { totalPeople?: string; totalMoney?: string; }>(data: T[]): T[] {
    const monthsToShow = this.getMonthsToShow();
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const filterStartYear = currentMonth <= monthsToShow ? currentYear - 1 : currentYear;
    const filterStartMonth = currentMonth <= monthsToShow ? 12 - (monthsToShow - currentMonth) + 1 : currentMonth - monthsToShow + 1;
    const filteredData = data.filter(item => {
      if (item.year === filterStartYear && item.month >= filterStartMonth) {
        return true;
      } else if (item.year === currentYear && item.month <= currentMonth) {
        return true;
      }
      return false;
    });
    return filteredData;
  }
  filterBySelectedCity(data: AllByCity[]): AllByCity[] {
    const filteredData: AllByCity[] = [];
    data.forEach(item => {
      const cityData = item.AllData[this.selectedInfoCity];
      if (cityData) {
        filteredData.push({ ...item, AllData: { [this.selectedInfoCity]: cityData } });
      }
    });
    return filteredData;
  }
  getMonthsToShow(): number {
    let monthsToShow = 0;
    switch (this.selectedPeriodInfoBkng) {
      case '6 months':
        monthsToShow = 6;
        break;
      case '1 year':
        monthsToShow = 12;
        break;
      case '2 years':
        monthsToShow = 24;
        break;
      default:
        break;
    }
    return monthsToShow;
  }
  prepareInfoBkngCityChartData(data: AllByCity[]): any {
    const labels: string[] = [];
    const datasets: any[] = [];
    if (!data || data.length === 0) {
        console.error('No data available for chart preparation');
        return null;
    }
    data.forEach((item: AllByCity) => {
        labels.push(`${item.month}-${item.year}`);
    });
    const cityData = data[0].AllData[this.selectedInfoCity];
    const totalBookingsData: string[] = [];
    const totalPeopleData: string[] = [];
    const totalMoneyData: string[] = [];
    // ========================== SETTINGS COLORS FOR DATASET 3 ===========================
    const colors = ['rgb(42,150,218)', 'rgb(194, 54, 71)', 'rgb(48, 166, 99)'];
    data.forEach((item: AllByCity) => {
        totalBookingsData.push(item.AllData[this.selectedInfoCity].totalBookings);
        totalPeopleData.push(item.AllData[this.selectedInfoCity].totalPeople);
        totalMoneyData.push(item.AllData[this.selectedInfoCity].totalMoney);
    });
    datasets.push({
        label: 'Bookings',
        data: totalBookingsData,
        borderWidth: 2, cubicInterpolationMode: 'monotone', borderColor: colors[0], color: colors[0], pointBackgroundColor: colors[0], pointHoverBackgroundColor: colors[0]
    });
    datasets.push({
        label: 'People',
        data: totalPeopleData,
        borderWidth: 2, cubicInterpolationMode: 'monotone', borderColor: colors[1], color: colors[1], pointBackgroundColor: colors[1], pointHoverBackgroundColor: colors[1]
    });
    datasets.push({
        label: 'Money',
        data: totalMoneyData,
        borderWidth: 2, cubicInterpolationMode: 'monotone', borderColor: colors[2], color: colors[2], pointBackgroundColor: colors[2], pointHoverBackgroundColor: colors[2]
    });
    return {
        labels: labels,
        datasets: datasets
    };
  }
  // ===========================================================================
  // ============================ RENDER CHART =================================
  // ===========================================================================
  renderChart(chartData: any, canvasId: string, chartType: ChartType) {
    const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!ctx) {
      return;
    }
    const existingChart = Chart.getChart(ctx);
    if (existingChart) {
      existingChart.destroy();
    }
    new Chart(ctx, {
      type: chartType,
      data: chartData,
      options: {

        scales: {
          x: {
            ticks: {
              color: 'rgba(150, 150, 150, 1)',
              padding: 10
            },
            grid: {
              color: 'rgba(0, 0, 0, 0)',
              z: -1
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: 'rgba(150, 150, 150, 1)',
              padding: 10
            },
            grid: {
              color: 'rgba(150, 150, 150, 0.1)',
              z: -1
            }
          }
        },
        // LEGENDA ZA CHART
        plugins: {
          legend: {
              display: false
          },
          tooltip:{
            padding: 10,
            boxPadding: 5,
            caretPadding: 20,
            bodySpacing: 5,
            backgroundColor: 'rgba(0, 0, 0, 0.8)'
          },
      }
      }
    });
  }
  onChangePeopleMonth(): void {
    this.fetchAndRenderPeopleData();
  }
  onChangeMoneyMonth(): void {
    this.fetchAndRenderMoneyData();
  }
  onChangePayTypeMonth(): void {
    this.fetchAndRenderPayType();
  }
  onChangePeopleCityMonth(): void {
    this.fetchAndRenderPeopleCityData();
  }
  onChangeInfoCity(): void {
    this.fetchAndRenderInfoBkngCity();
  }
  onChangeInfoPeriod(): void {
    this.fetchAndRenderInfoBkngCity();
  }
}
