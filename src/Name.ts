import { createIsomorphism } from './base/isomorphic-value-object';

export const Name = createIsomorphism<string, 'Name'>();
export type Name = ReturnType<typeof Name.to>;
