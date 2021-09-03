import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { NGXLogger } from 'ngx-logger';
import { Debt } from '../model/debt.model';
import { Banks } from '../model/banks.model';
import { Constants } from '../model/constants.model';

@Injectable({
  providedIn: 'root',
})
export class DebtService {
  constructor(private logger: NGXLogger, private http: HttpClient) {}

  // bank_url = './assets/banks.json';
  bank_url =
    'https://gist.githubusercontent.com/dangduytung/658acdf3dcb7fa42558e6c52d0cfd97d/raw/d329132ef79ab74baae9d79a5b249fa69e6b705d/interest-housing-bank_2020-08.json';

  getBanks(): Observable<Banks[]> {
    return this.http.get<Banks[]>(this.bank_url);
  }

  getDebts(
    money: number,
    moneyOriginalMonth: number,
    months: number,
    interest: number,
    preferentialMonth: any
  ): Observable<Debt[]> {
    const debts: Debt[] = [];

    let moneyInterestMonth: number;
    let moneyInterestPreference: any;

    debts.push(new Debt(0, money, 0, 0, 0));

    for (let i = 1; i < months + 1; i++) {
      moneyInterestMonth = Math.round((money * interest) / (100 * 12));
      moneyInterestPreference = undefined;

      if (preferentialMonth !== undefined) {
        if (i <= preferentialMonth.month) {
          moneyInterestPreference = Math.round(
            (money * preferentialMonth.interest) / (100 * 12)
          );
        }
      }

      money -= moneyOriginalMonth;

      const debt = new Debt(
        i,
        money,
        moneyOriginalMonth,
        moneyInterestMonth,
        moneyInterestPreference
      );
      debts.push(debt);
    }
    return of(debts);
  }

  getPreferentialMonths(bank: any) {
    const preferentialMonths: any[] = [];
    if (bank !== undefined) {
      if (bank.m3 !== undefined) {
        preferentialMonths.push({
          month: Constants.PREFERENCE_MONTHS.m3_label,
          interest: bank.m3,
        });
      }
      if (bank.m6 !== undefined) {
        preferentialMonths.push({
          month: Constants.PREFERENCE_MONTHS.m6_label,
          interest: bank.m6,
        });
      }
      if (bank.m12 !== undefined) {
        preferentialMonths.push({
          month: Constants.PREFERENCE_MONTHS.m12_label,
          interest: bank.m12,
        });
      }
      if (bank.m24 !== undefined) {
        preferentialMonths.push({
          month: Constants.PREFERENCE_MONTHS.m24_label,
          interest: bank.m24,
        });
      }
      if (bank.m36 !== undefined) {
        preferentialMonths.push({
          month: Constants.PREFERENCE_MONTHS.m36_label,
          interest: bank.m36,
        });
      }
    }
    this.logger.debug(
      'preferentialMonths : ' + JSON.stringify(preferentialMonths)
    );
    return preferentialMonths;
  }
}
