export type ExperimentStatus = "developing" | "released" | "testing" | "closed";

export const EXPERIMENT_STATUS_LABEL: Record<ExperimentStatus, string> = {
  developing: "開発中",
  released: "公開済み",
  testing: "検証中",
  closed: "終了",
};

export type Experiment = {
  id: string;
  name: string;
  description: string;
  status: ExperimentStatus;
  url?: string;
};

/**
 * ここに実験(プロダクト)を追加していく。失敗して終了したものも
 * status: "closed" として残し、実験の履歴として見せる。
 * 現時点では空でよい(セクション側でプレースホルダーを表示する)。
 */
export const experiments: Experiment[] = [];
