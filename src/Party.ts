import { Member } from './Member';
import { TotalPayment } from './TotalPayment';
import { Payment } from './Payment';
import { PaymentType } from './PaymentType';
import { PaymentRatio } from './PaymentRatio';
import { MemberId } from './MemberId';

// TODO: First Class Collection にする
type Members = Array<Member>;

// TODO: First Class Collection にする
type RatioTable = Record<PaymentType, PaymentRatio>;

export interface Party {
  members: Members;
  totalPayment: TotalPayment;
  date: Date;
  ratioTable: RatioTable;
}

function create(date: Date, ratioTable: RatioTable): Party {
  return {
    members: [],
    totalPayment: TotalPayment.create(0, 'JPY'), // TODO: currency as argument
    date,
    ratioTable,
  };
}

function addPayment(party: Party, payment: Payment): Party {
  party.totalPayment = Payment.add(party.totalPayment, payment);
  return party;
}

function subtractPayment(party: Party, payment: Payment): Party {
  party.totalPayment = Payment.subtract(party.totalPayment, payment);
  return party;
}

function addMember(party: Party, member: Member): Party {}

function removeMember(party: Party): Party {}

function splitBill(party: Party): Record<MemberId, Payment> {}

export const Party = {
  create,
  addPayment,
  subtractPayment,
  showTotalAmount,
  addMember,
  removeMember,
  showMembers,
  splitBill,
};
