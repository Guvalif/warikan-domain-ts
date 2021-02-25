import { ProductTagged } from '../base/product-tagged';

type Currency = 'JPY' | 'USD' | 'EUR';

export type Money = ProductTagged<
  {
    amount: number;
    currency: Currency;
  },
  'Money'
>;

function create(amount: number, currency: Currency): Money {
  return {
    _tag: 'Money',
    amount,
    currency,
  };
}

function equals(lhs: Money, rhs: Money): boolean {
  return lhs.amount === rhs.amount && lhs.currency === rhs.currency;
}

function abs(money: Money): Money {
  return {
    ...money,
    amount: Math.abs(money.amount),
  };
}

function negated(money: Money): Money {
  return {
    ...money,
    amount: -money.amount,
  };
}

function compare(lhs: Money, rhs: Money): -1 | 0 | 1 {
  if (lhs.currency !== rhs.currency) throw new Error('IllegalArgumentError');

  if (lhs.amount < rhs.amount) return -1;
  if (lhs.amount > rhs.amount) return 1;

  return 0;
}

function dividedBy(money: Money, divisor: number): Money {
  return {
    ...money,
    amount: money.amount / divisor,
  };
}

function times(money: Money, other: number): Money {
  return {
    ...money,
    amount: money.amount * other,
  };
}

function add(lhs: Money, rhs: Money): Money {
  if (lhs.currency !== rhs.currency) throw new Error('IllegalArgumentError');

  return {
    ...lhs,
    amount: lhs.amount + rhs.amount,
  };
}

function subtract(lhs: Money, rhs: Money): Money {
  if (lhs.currency !== rhs.currency) throw new Error('IllegalArgumentError');

  return {
    ...lhs,
    amount: lhs.amount - rhs.amount,
  };
}

function isGreaterThan(lhs: Money, rhs: Money): boolean {
  return compare(lhs, rhs) === 1;
}

function isLessThan(lhs: Money, rhs: Money): boolean {
  return compare(lhs, rhs) === -1;
}

function isPositive(money: Money): boolean {
  return compare(money, create(0, money.currency)) === 1;
}

function isNegative(money: Money): boolean {
  return compare(money, create(0, money.currency)) === -1;
}

function isZero(money: Money): boolean {
  return compare(money, create(0, money.currency)) === 0;
}

export const Money = {
  abs,
  add,
  compare,
  create,
  dividedBy,
  equals,
  isGreaterThan,
  isLessThan,
  isNegative,
  isPositive,
  isZero,
  negated,
  subtract,
  times,
};
