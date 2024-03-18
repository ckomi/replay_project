import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DashboardData } from '../models/statistic.model';
import { Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {
  private baseUrl = 'http://localhost:8080/api/statistics';

  private dashBoardData:any = [];
  private totalPeople:any = [];
  private totalMoney:any = [];
  private sumPayType:any = [];
  private peopleCity:any = [];
  private allInfoCity:any = [];

  constructor(private http: HttpClient) {
    this.clearLocalStorage()
    this.initDash();
    this.initTotPppl();
    this.initTotMny();
    this.initSumPayType();
    this.initPeopleCity();
    this.initAllByCity();
  }

  fetchDashBoard(): Observable<any> {
    if (this.dashBoardData) {
      return of(this.dashBoardData);
    } else {
      const localStorageData = localStorage.getItem('dashboardData');
      if (localStorageData) {
        this.dashBoardData = JSON.parse(localStorageData);
        return of(this.dashBoardData);
      } else {
        return this.initDash();
      }
    }
  }

  fetchPeopleByMonth():Observable<any>{
    if (this.totalPeople) {
      return of(this.totalPeople);
    } else {
      const localStorageData = localStorage.getItem('totalPeople');
      if (localStorageData) {
        this.totalPeople = JSON.parse(localStorageData);
        return of(this.totalPeople);
      } else {
        return this.initTotPppl();
      }
    }
  }
  fetchMoneyByMonth():Observable<any>{
    if (this.totalMoney) {
      return of(this.totalMoney);
    } else {
      const localStorageData = localStorage.getItem('totalPeople');
      if (localStorageData) {
        this.totalMoney = JSON.parse(localStorageData);
        return of(this.totalMoney);
      } else {
        return this.initTotMny();
      }
    }
  }
  fetchSumPayTypeMonthly():Observable<any>{
    if (this.sumPayType) {
      return of(this.sumPayType);
    } else {
      const localStorageData = localStorage.getItem('totalPeople');
      if (localStorageData) {
        this.sumPayType = JSON.parse(localStorageData);
        return of(this.sumPayType);
      } else {
        return this.initSumPayType();
      }
    }
  }
  fetchPeopleCity():Observable<any>{
    if (this.peopleCity) {
      return of(this.peopleCity);
    } else {
      const localStorageData = localStorage.getItem('peopleCity');
      if (localStorageData) {
        this.peopleCity = JSON.parse(localStorageData);
        return of(this.peopleCity);
      } else {
        return this.initPeopleCity();
      }
    }
  }
  fetchAllByCity():Observable<any>{
    if (this.allInfoCity) {
      return of(this.allInfoCity);
    } else {
      const localStorageData = localStorage.getItem('allInfoCity');
      if (localStorageData) {
        this.allInfoCity = JSON.parse(localStorageData);
        return of(this.allInfoCity);
      } else {
        return this.initAllByCity();
      }
    }
  }


  private initDash(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.baseUrl}`)
      .pipe(
        tap(data => {
          this.dashBoardData = data;
          localStorage.setItem('dashboardData', JSON.stringify(data));
        })
      );
  }
  private initTotPppl(): Observable<any> {
    return this.http.get<any[]>(`${this.baseUrl}/totalPeopleByMonth`)
      .pipe(
        tap(data => {
          this.totalPeople = data;
          localStorage.setItem('totalPeople', JSON.stringify(data));
        })
      );
  }
  private initTotMny(): Observable<any> {
    return this.http.get<any[]>(`${this.baseUrl}/totalMoneyByMonth`)
      .pipe(
        tap(data => {
          this.totalMoney = data;
          localStorage.setItem('totalMoney', JSON.stringify(data));
        })
      );
  }
  private initSumPayType(): Observable<any> {
    return this.http.get<any[]>(`${this.baseUrl}/payTypeSumMonth`)
      .pipe(
        tap(data => {
          this.sumPayType = data;
          localStorage.setItem('sumPayType', JSON.stringify(data));
        })
      );
  }
  private initPeopleCity(): Observable<any> {
    return this.http.get<any[]>(`${this.baseUrl}/peopleByCity`)
      .pipe(
        tap(data => {
          this.peopleCity = data;
          localStorage.setItem('peopleCity', JSON.stringify(data));
        })
      );
  }
  private initAllByCity(): Observable<any> {
    return this.http.get<any[]>(`${this.baseUrl}/allInfoByCity`)
      .pipe(
        tap(data => {
          this.allInfoCity = data;
          localStorage.setItem('allInfoCity', JSON.stringify(data));
        })
      );
  }







  clearLocalStorage() {
    localStorage.removeItem('dashboardData');
    this.dashBoardData = null;
    localStorage.removeItem('totalPeople');
    this.totalPeople = null;
    localStorage.removeItem('totalMoney');
    this.totalMoney = null;
    localStorage.removeItem('sumPayType');
    this.sumPayType = null;
    localStorage.removeItem('peopleCity');
    this.peopleCity = null;
    localStorage.removeItem('allInfoCity');
    this.allInfoCity = null;
  }
}
