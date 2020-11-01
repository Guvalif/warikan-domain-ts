import { PaymentType } from './PaymentType';
import { MemberId } from './MemberId';

export interface PartyMember {
  id: MemberId;
  name: string;
  paymentType: PaymentType;
}

export function createMember(name: string, paymentType: PaymentType) {
  return {};
}
