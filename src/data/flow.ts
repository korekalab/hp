export type FlowStep = {
  number: string;
  title: string;
  description: string;
};

export const flowSteps: FlowStep[] = [
  { number: "01", title: "思いつく", description: "「これ面白そう」の直感を逃さない。" },
  { number: "02", title: "まずつくる", description: "計画より先に、小さく手を動かす。" },
  { number: "03", title: "世の中に出す", description: "完璧じゃなくても、まず届ける。" },
  { number: "04", title: "反応を見る", description: "使われ方、声、数字を観察する。" },
  { number: "05", title: "面白ければ育てる", description: "反応があったものにもっと注ぐ。" },
];
