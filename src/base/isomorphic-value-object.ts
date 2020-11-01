type PrimitiveTypes = boolean | number | string | null;

type ValueObject<X extends PrimitiveTypes, Tag extends string> = X & { [K in Tag]: never };

interface Isomorphism<X extends PrimitiveTypes, Tag extends string> {
  to: (x: X) => ValueObject<X, Tag>;
  from: (v: ValueObject<X, Tag>) => X;
  equals: (v0: ValueObject<X, Tag>, v1: ValueObject<X, Tag>) => boolean;
  unsafeCoerce: (x: X) => ValueObject<X, Tag>;
}

export function createIsomorphism<X extends PrimitiveTypes, Tag extends string>(): Isomorphism<
  X,
  Tag
> {
  type V = ValueObject<X, Tag>;

  const to = (x: X) => x as V;
  const from = (v: V) => v as X;
  const equals = (v0: V, v1: V): boolean => (v0 as X) === (v1 as X);

  return {
    to,
    from,
    equals,
    unsafeCoerce: to,
  };
}

export function withAssertions<X extends PrimitiveTypes, Tag extends string>(
  isomorphism: Isomorphism<X, Tag>,
  assertions: Array<(x: X) => void | never>,
): Isomorphism<X, Tag> {
  return {
    ...isomorphism,
    to: (x: X) => {
      assertions.forEach((assertion) => assertion(x));

      return isomorphism.to(x);
    },
  };
}

export function withDefault<X extends PrimitiveTypes, Tag extends string>(
  isomorphism: Isomorphism<X, Tag>,
  defaultValue: X,
): Isomorphism<X, Tag> & { DEFAULT: ValueObject<X, Tag> } {
  return {
    ...isomorphism,
    DEFAULT: isomorphism.unsafeCoerce(defaultValue),
  };
}
