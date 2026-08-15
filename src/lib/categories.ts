export type CategoryId = "development" | "media" | "knowhow" | "case";

export const CATEGORY_LABEL: Record<CategoryId, string> = {
  development: "開発",
  media: "メディア",
  knowhow: "ノウハウ",
  case: "事例",
};

export const CATEGORY_IDS: CategoryId[] = ["development", "media", "knowhow", "case"];

export const CATEGORY_TABS: { id: CategoryId | "all"; label: string }[] = [
  { id: "all", label: "ALL" },
  ...CATEGORY_IDS.map((id) => ({ id, label: CATEGORY_LABEL[id] })),
];

export function isCategoryId(value: string | undefined): value is CategoryId {
  return !!value && (CATEGORY_IDS as string[]).includes(value);
}
