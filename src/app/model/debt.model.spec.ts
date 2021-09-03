import { Debt } from './debt.model';

describe('Debt', () => {
  it('should create an instance', () => {
    expect(new Debt(1,2,3,4,5)).toBeTruthy();
  });
});
