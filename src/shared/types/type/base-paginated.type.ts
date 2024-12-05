export type BasePaginated<Name extends string, Type> = { [P in Name]: Type[] } & {
  total: number;
  nextCursor: number;
};
