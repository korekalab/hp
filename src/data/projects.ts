export type ProjectIcon = "app" | "media" | "marketing" | "event" | "more";

export type ProjectCategory = {
  id: ProjectIcon;
  number: string;
  label: string;
  labelEn: string;
  description: string;
  icon: ProjectIcon;
};

/**
 * 現在取り組んでいる領域。並び替え・追加・削除はこの配列を編集するだけでよい。
 */
export const projectCategories: ProjectCategory[] = [
  {
    id: "app",
    number: "01",
    label: "アプリ / Webサービス",
    labelEn: "APP / WEB SERVICE",
    description:
      "日常のちょっとした不便や「こんなのあったら面白いかも」というアイデアを、AIを活用しながら素早くプロダクトにしています。小さく作り、実際にリリースして、ユーザーの反応を見ながら改善します。",
    icon: "app",
  },
  {
    id: "media",
    number: "02",
    label: "メディア / アフィリエイト",
    labelEn: "MEDIA / AFFILIATE",
    description:
      "特定のテーマに特化したWebメディア、SNS、noteなどを運営。コンテンツを作り、人を集め、そこから収益が生まれる仕組みそのものを実験しています。",
    icon: "media",
  },
  {
    id: "marketing",
    number: "03",
    label: "マーケティング",
    labelEn: "MARKETING",
    description:
      "SEO、Web広告、SNS、コンテンツ、イベントなど「良いものをどうすれば必要な人に届けられるか」を実践します。机上の研究ではなく、実際のプロジェクトを通して試していきます。",
    icon: "marketing",
  },
  {
    id: "event",
    number: "04",
    label: "イベント・企画",
    labelEn: "EVENT",
    description:
      "オンライン・オフラインを問わず、人と人、アイデアと人が出会う企画やイベントにも取り組みます。Webだけに閉じず、面白いと思ったことはリアルな場でも実験します。",
    icon: "event",
  },
  {
    id: "more",
    number: "05",
    label: "そして、これから。",
    labelEn: "AND MORE...",
    description:
      "コレカラボが今後何を始めるかは、まだ決めきっていません。面白いものを見つけたら、その都度、新しい実験を始めます。",
    icon: "more",
  },
];

export function isProjectCategoryId(value: string | undefined): value is ProjectIcon {
  return !!value && projectCategories.some((c) => c.id === value);
}

export function getProjectCategory(id: ProjectIcon): ProjectCategory {
  return projectCategories.find((c) => c.id === id)!;
}
