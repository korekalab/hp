export type CategoryId = "blog" | "knowhow" | "devlog" | "case" | "column";

export const CATEGORY_LABEL: Record<CategoryId, string> = {
  blog: "ブログ",
  knowhow: "ノウハウ",
  devlog: "開発記録",
  case: "事例",
  column: "コラム",
};

export const CATEGORY_IDS: CategoryId[] = ["blog", "knowhow", "devlog", "case", "column"];

export const CATEGORY_TABS: { id: CategoryId | "all"; label: string }[] = [
  { id: "all", label: "ALL" },
  ...CATEGORY_IDS.map((id) => ({ id, label: CATEGORY_LABEL[id] })),
];

export function isCategoryId(value: string | undefined): value is CategoryId {
  return !!value && (CATEGORY_IDS as string[]).includes(value);
}
