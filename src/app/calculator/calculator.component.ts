import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { Subscription } from 'rxjs';
import { NGXLogger } from 'ngx-logger';
import { Debt } from '../model/debt.model';
import { Banks } from '../model/banks.model';
import { DebtService } from '../service/debt.service';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css'],
})
export class CalculatorComponent implements OnInit, OnDestroy {
  period = 20; // chu ky lai
  periodOptions: Options = {
    floor: 3,
    ceil: 30,
  };

  interest = 11; // lai suat
  interestOptions: Options = {
    floor: 5,
    step: 0.1,
    ceil: 15,
  };

  interestItems: any[] = [
    { id: 1, name: '10%', value: 10 },
    { id: 2, name: '20%', value: 20 },
    { id: 3, name: '30%', value: 30 },
    { id: 4, name: '40%', value: 40 },
    { id: 5, name: '50%', value: 50 },
    { id: 6, name: '60%', value: 60 },
    { id: 7, name: '70%', value: 70 },
    { id: 8, name: '80%', value: 80 },
    { id: 9, name: '90%', value: 90 },
  ];
  selected = 3;

  moneyHouse = 1000000000; // tien nha
  moneyPrepaid!: number; // tien tra truoc
  money!: number; // tien nha con thieu
  moneyOriginalMonth!: number; // tien goc hang thang
  moneyInterestTotal = 0; // tong tien lai chua uu dai
  moneyInterestPreferenceTotal = 0; // tong tien lai co uu dai

  debts: Debt[] = []; // Du no giam dan
  subscription!: Subscription;

  bankList!: Banks[];
  bankPreference: any;
  preferentialMonths: any[] = [];
  preferentialMonth: any;

  constructor(private logger: NGXLogger, private debtService: DebtService) {}

  ngOnInit(): void {
    this.debtService.getBanks().subscribe((data) => (this.bankList = data));
    this.calculateTotal();
  }

  selectPrepaid(event: any) {
    this.calculateTotal();
  }

  selectBank(event: any) {
    this.preferentialMonth = undefined;
    this.bankPreference = this.bankList.find(
      (x) => x.short_name == event.target.value
    );
    this.logger.info(this.bankPreference);
    this.preferentialMonths = this.debtService.getPreferentialMonths(
      this.bankPreference
    );
    this.calculate();
  }

  selectBankInterest() {
    this.logger.debug(
      `preferentialMonth : ${JSON.stringify(this.preferentialMonth)}`
    );
    this.calculate();
  }

  getMoneyPrepaid() {
    this.moneyPrepaid =
      (this.moneyHouse * this.interestItems[this.selected - 1].value) / 100;
    this.moneyPrepaid = Math.round(this.moneyPrepaid);
  }

  calculateMoney() {
    this.money = this.moneyHouse - this.moneyPrepaid;
    this.moneyOriginalMonth = this.money / (this.period * 12);
    this.moneyOriginalMonth = Math.round(this.moneyOriginalMonth);
  }

  calculateAll(isChangePrepaid: boolean) {
    this.reset();

    if (isChangePrepaid) {
      this.getMoneyPrepaid();
    }

    this.calculateMoney();

    this.debtDescending();

    this.sumMoneyInterestTotal();
  }

  calculate() {
    this.calculateAll(false);
  }

  calculateTotal() {
    this.calculateAll(true);
  }

  @HostListener('input', ['$event']) onEvent(event: {
    target: { id: string };
  }) {
    this.logger.debug('onEvent ' + event.target.id);
    switch (event.target.id) {
      case 'price':
        this.calculateTotal();
        break;
      case 'period':
      case 'interest':
        this.calculate();
        break;
      default:
        break;
    }
  }

  reset() {
    this.moneyInterestTotal = 0;
    this.debts = [];
    this.moneyInterestTotal = 0;
    this.moneyInterestPreferenceTotal = 0;
  }

  debtDescending() {
    this.subscription = this.debtService
      .getDebts(
        this.money,
        this.moneyOriginalMonth,
        this.period * 12,
        this.interest,
        this.preferentialMonth
      )
      .subscribe((debtsData: Debt[]) => {
        this.debts = debtsData;
      });
  }

  sumMoneyInterestTotal() {
    if (this.preferentialMonth === undefined || this.preferentialMonth === '') {
      this.debts.forEach((debt) => {
        this.moneyInterestTotal += debt.moneyInterestMonth;
      });
    } else {
      this.debts.forEach((debt) => {
        this.moneyInterestTotal += debt.moneyInterestMonth;
        if (debt.id <= this.preferentialMonth.month) {
          this.moneyInterestPreferenceTotal += debt.moneyInterestPreference;
        } else {
          this.moneyInterestPreferenceTotal += debt.moneyInterestMonth;
        }
      });
    }
  }

  ngOnDestroy(): void {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
}
