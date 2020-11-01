import { createIsomorphism } from './base/isomorphic-value-object';

export const PaymentRatio = createIsomorphism<number, 'PaymentRatio'>();
export type PaymentRatio = ReturnType<typeof PaymentRatio.to>;
