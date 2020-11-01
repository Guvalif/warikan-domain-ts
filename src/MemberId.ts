import { createIsomorphism } from './base/isomorphic-value-object';

let uniqueCounter = 0;

const _MemberId = createIsomorphism<number, 'MemberId'>();

function createUniqueMemberId(): MemberId {
  return _MemberId.to(uniqueCounter++);
}

export const MemberId = {
  ..._MemberId,
  createUniqueMemberId,
};

export type MemberId = ReturnType<typeof MemberId.to>;
