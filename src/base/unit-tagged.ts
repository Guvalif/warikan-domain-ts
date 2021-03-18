type PrimitiveTypes = boolean | number | string | null;

type UnitTagged<X extends PrimitiveTypes, Tag extends string> = X & { [K in Tag]: never };

interface Isomorphism<X extends PrimitiveTypes, Tag extends string> {
  readonly to: (x: X) => UnitTagged<X, Tag>;
  readonly from: (v: UnitTagged<X, Tag>) => X;
  readonly equals: (v0: UnitTagged<X, Tag>, v1: UnitTagged<X, Tag>) => boolean;
  readonly unsafeCoerce: (x: X) => UnitTagged<X, Tag>;
}

export function createIsomorphism<X extends PrimitiveTypes, Tag extends string>(): Isomorphism<
  X,
  Tag
> {
  type V = UnitTagged<X, Tag>;

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
  assertions: Array<(x: X) => void | never>,
): (isomorphism: Isomorphism<X, Tag>) => Isomorphism<X, Tag> {
  return (isomorphism) => ({
    ...isomorphism,
    to: (x: X) => {
      assertions.forEach((assertion) => assertion(x));

      return isomorphism.to(x);
    },
  });
}

export function withDefault<X extends PrimitiveTypes, Tag extends string>(
  defaultValue: X,
): (
  isomorphism: Isomorphism<X, Tag>,
) => Isomorphism<X, Tag> & { readonly DEFAULT: UnitTagged<X, Tag> } {
  return (isomorphism) => ({
    ...isomorphism,
    DEFAULT: isomorphism.unsafeCoerce(defaultValue),
  });
}
