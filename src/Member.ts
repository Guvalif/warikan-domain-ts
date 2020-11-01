import { MemberId } from './MemberId';
import { PaymentType } from './PaymentType';
import { Name } from './Name';

export interface Member {
  _tag: 'Member';
  id: MemberId;
  name: Name;
  paymentType: PaymentType;
}

function createMember(name: Name, paymentType: PaymentType): Member {
  return {
    _tag: 'Member',
    id: MemberId.createUniqueMemberId(),
    name,
    paymentType,
  };
}

const Member = {
  createMember,
};
