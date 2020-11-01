import { Money } from './Money';

describe('abs', () => {
  test('+ to +', () => {
    const money = Money.create(100, 'JPY');

    expect(Money.abs(money).amount).toEqual(money.amount);
  });

  test('- to +', () => {
    const money = Money.create(-100, 'JPY');

    expect(Money.abs(money).amount).toEqual(-money.amount);
  });
});

describe('add', () => {
  test('same currency', () => {
    const lhs = Money.create(100, 'JPY');
    const rhs = Money.create(100, 'JPY');

    expect(Money.add(lhs, rhs).amount).toEqual(lhs.amount + rhs.amount);
  });

  test('different currency', () => {
    const lhs = Money.create(100, 'JPY');
    const rhs = Money.create(100, 'USD');

    expect(() => Money.add(lhs, rhs).amount).toThrow();
  });
});

describe('compare', () => {
  test('lhs === rhs', () => {
    const lhs = Money.create(100, 'JPY');
    const rhs = Money.create(100, 'JPY');

    expect(Money.compare(lhs, rhs)).toEqual(0);
  });

  test('lhs < rhs', () => {
    const lhs = Money.create(100, 'JPY');
    const rhs = Money.create(200, 'JPY');

    expect(Money.compare(lhs, rhs)).toEqual(-1);
  });

  test('lhs > rhs', () => {
    const lhs = Money.create(200, 'JPY');
    const rhs = Money.create(100, 'JPY');

    expect(Money.compare(lhs, rhs)).toEqual(1);
  });

  test('different currency', () => {
    const lhs = Money.create(100, 'JPY');
    const rhs = Money.create(100, 'USD');

    expect(() => Money.compare(lhs, rhs)).toThrow();
  });
});

describe('equals', () => {
  test('same currency, same amount', () => {
    const lhs = Money.create(100, 'JPY');
    const rhs = Money.create(100, 'JPY');

    expect(Money.equals(lhs, rhs)).toEqual(true);
  });

  test('same currency, different amount', () => {
    const lhs = Money.create(100, 'JPY');
    const rhs = Money.create(200, 'JPY');

    expect(Money.equals(lhs, rhs)).toEqual(false);
  });

  test('different currency, same amount', () => {
    const lhs = Money.create(100, 'JPY');
    const rhs = Money.create(100, 'USD');

    expect(Money.equals(lhs, rhs)).toEqual(false);
  });

  test('different currency, different amount', () => {
    const lhs = Money.create(100, 'JPY');
    const rhs = Money.create(200, 'USD');

    expect(Money.equals(lhs, rhs)).toEqual(false);
  });
});

describe('negated', () => {
  test('+ to -', () => {
    const money = Money.create(100, 'JPY');

    expect(Money.negated(money).amount).toEqual(-money.amount);
  });

  test('- to +', () => {
    const money = Money.create(-100, 'JPY');

    expect(Money.negated(money).amount).toEqual(-money.amount);
  });
});

describe('subtract', () => {
  test('same currency', () => {
    const lhs = Money.create(100, 'JPY');
    const rhs = Money.create(100, 'JPY');

    expect(Money.subtract(lhs, rhs).amount).toEqual(lhs.amount - rhs.amount);
  });

  test('different currency', () => {
    const lhs = Money.create(100, 'JPY');
    const rhs = Money.create(100, 'USD');

    expect(() => Money.subtract(lhs, rhs).amount).toThrow();
  });
});
