export type ProductTagged<P, Tag extends string> = {
  readonly _tag: Tag;
} & Readonly<P>;
