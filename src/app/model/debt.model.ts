export class Debt {
  id: number;
  moneyRemaining: number;        // tien goc con lai
  moneyOriginalMonth: number;    // tien goc hang thang
  moneyInterestMonth: number;    // tien lai hang thang
  moneyInterestPreference: number;   // tien lai hang thang duoc uu dai

  constructor(id: number, moneyRemaining: number, moneyOriginalMonth: number, moneyInterestMonth: number, moneyInterestPreference: number) {
    this.id = id;
    this.moneyRemaining = moneyRemaining;
    this.moneyOriginalMonth = moneyOriginalMonth;
    this.moneyInterestMonth = moneyInterestMonth;
    this.moneyInterestPreference = moneyInterestPreference;
  }
}
