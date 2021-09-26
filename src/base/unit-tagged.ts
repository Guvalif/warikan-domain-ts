import { DomainError } from './domain-error';

type UnitRaw = boolean | number | string | null;

/**
 * "タグづけによる区別を施した値型" を生成するカインド
 *
 * @template X UnitRaw で表される値型を上限として、型を渡す
 * @template Tag String Literal Type によるタグ名を渡す
 */
type UnitTagged<X extends UnitRaw, Tag extends string> = X & { [K in Tag]: never };

/**
 * "単一値型 => タグづけによる区別を施した値型" のファクトリを表す型
 *
 * @property to: 完全コンストラクタ
 * @property guard: 値の検証のみを行う関数
 * @property unsafeCoerce: 強制変換コンストラクタ (値の検証が必要無い場合に用いる)
 */
interface Isomorphism<X extends UnitRaw, Tag extends string> {
  readonly to: (x: X) => UnitTagged<X, Tag> | never;
  readonly guard: (x: X) => DomainError | true;
  readonly unsafeCoerce: (x: X) => UnitTagged<X, Tag>;
}

/**
 * "複数値型 => タグづけによる区別を施した値型" のファクトリを表す型
 *
 * @property to: 完全コンストラクタ
 * @property guard: 値の検証のみを行う関数
 * @property unsafeCoerce: 強制変換コンストラクタ (値の検証が必要無い場合に用いる)
 */
interface Multimorphism<Args extends readonly any[], X extends UnitRaw, Tag extends string> {
  readonly to: (...args: Args) => UnitTagged<X, Tag> | never;
  readonly guard: (...args: Args) => DomainError | true;
  readonly unsafeCoerce: (x: X) => UnitTagged<X, Tag>;
}

/**
 * "単一値型 => タグづけによる区別を施した値型" なるファクトリの生成関数
 *
 * @template X UnitRaw で表される値型を上限として、型を渡す
 * @template Tag String Literal Type によるタグ名を渡す
 *
 * @example
 * ```
 * // 'UserId' タグによって区別された文字列型の、ファクトリを export
 * export const UserId = createIsomorphism<string, 'UserID'>();
 *
 * // 'UserId' タグによって区別された文字列型を、型エイリアスとして export
 * export type UserId = ReturnType<typeof UserId.to>;
 * ```
 */
export function createIsomorphism<X extends UnitRaw, Tag extends string>(): Isomorphism<X, Tag> {
  type TaggedX = UnitTagged<X, Tag>;

  const to = (x: X) => x as TaggedX;
  const guard = (_: X) => true as const;

  return {
    to,
    guard,
    unsafeCoerce: to,
  };
}

/**
 * "複数値型 => タグづけによる区別を施した値型" なるファクトリの生成関数
 *
 * @param factory 複数値から計算を行い、値を構成する部分関数を渡す
 * @param _tag タグ名を渡す (型推論のために必要)
 *
 * @example
 * ```
 * // 'Bmi' タグによって区別された数値型の、ファクトリを export
 * export const Bmi = createMultimorphism(
 *   (h_cm, w_kg) => w_kg / (h_cm ** 2),
 *   'Bmi',
 * );
 *
 * // 'Bmi' タグによって区別された数値型を、型エイリアスとして export
 * export const Bmi = tyoeof ReturnType<Bmi.to>;
 * ```
 */
export function createMultimorphism<
  Args extends readonly any[],
  X extends UnitRaw,
  Tag extends string
>(factory: (...args: Args) => X | never, _tag: Tag): Multimorphism<Args, X, Tag> {
  type TaggedX = UnitTagged<X, Tag>;

  const to = (...args: Args) => factory(...args) as TaggedX;

  const guard = (...args: Args) => {
    try {
      factory(...args);

      return true as const;
    } catch (e: unknown) {
      if (e instanceof DomainError) {
        return e;
      }

      return new DomainError('Unknown Domain Error');
    }
  };

  const unsafeCoerce = (x: X) => x as TaggedX;

  return {
    to,
    guard,
    unsafeCoerce,
  };
}

/**
 * ファクトリ内の完全コンストラクタに、制約を付与する関数
 *
 * @param assertions `[Curried]` 完全コンストラクタを構成する制約を、部分関数の配列として渡す
 * @param morphism `[Curried]` 制約を付与したいファクトリを渡す
 *
 * @example
 * ```
 * const UserId = createIsomorphism<string, 'UserID'>();
 *
 * const UserIdWithAssertions = withAssertions<string, 'UserID'>([
 *   (id) => {
 *     if (id.length === 0) throw new DomainError('"UserId" should not be empty!');
 *   },
 * ])(UserId);
 * ```
 */
export function withAssertions<X extends UnitRaw, Tag extends string>(
  assertions: Array<(x: X) => void | never>,
): (morphism: Isomorphism<X, Tag>) => Isomorphism<X, Tag> {
  return (morphism) => {
    const to = (x: X) => {
      assertions.forEach((assertion) => assertion(x));

      return morphism.to(x);
    };

    const guard = (x: X) => {
      try {
        to(x);

        return true as const;
      } catch (e: unknown) {
        if (e instanceof DomainError) {
          return e;
        }

        return new DomainError('Unknown Domain Error');
      }
    };

    return {
      ...morphism,
      to,
      guard,
    };
  };
}

/**
 * ファクトリにデフォルト値を付与する関数
 *
 * @param defaultValue `[Curried]` デフォルト値を渡す
 * @param morphism `[Curried]` デフォルト値を付与したいファクトリを渡す
 *
 * @example
 * ```
 * const UserName = createIsomorphism<string, 'UserName'>();
 *
 * const UserNameWithDefault = withDefault<string, 'UserName'>('Unknown')(UserName);
 * ```
 */
export function withDefault<X extends UnitRaw, Tag extends string>(
  defaultValue: X,
): (
  morphism: Isomorphism<X, Tag>,
) => Isomorphism<X, Tag> & { readonly DEFAULT: UnitTagged<X, Tag> };

/**
 * ファクトリにデフォルト値を付与する関数
 *
 * @param defaultValue `[Curried]` デフォルト値を渡す
 * @param morphism `[Curried]` デフォルト値を付与したいファクトリを渡す
 *
 * @example
 * ```
 * const Bmi = createMultimorphism(
 *   (h_cm, w_kg) => w_kg / (h_cm ** 2),
 *   'Bmi',
 * );
 *
 * const BmiWithDefaul = withDefault<[h_cm: number, w_kg: number], number, 'Bmi'>(22)(Bmi);
 * ```
 */
export function withDefault<Args extends readonly any[], X extends UnitRaw, Tag extends string>(
  defaultValue: X,
): (
  morphism: Multimorphism<Args, X, Tag>,
) => Multimorphism<Args, X, Tag> & { readonly DEFAULT: UnitTagged<X, Tag> };

export function withDefault<X extends UnitRaw, Tag extends string>(
  defaultValue: X,
): <T>(morphism: T) => T & { readonly DEFAULT: UnitTagged<X, Tag> } {
  return (morphism) => ({
    ...morphism,
    DEFAULT: defaultValue as UnitTagged<X, Tag>,
  });
}
