/**
 * "タグづけによる区別を施した不変な直積型" を生成するカインド
 *
 * @template P Interface などによるオブジェクトの型を渡す
 * @template Tag String Literal Type によるタグ名を渡す
 */
export type ProductTagged<P, Tag extends string> = {
  readonly _tag: Tag;
} & Readonly<P>;
