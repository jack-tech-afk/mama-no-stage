export type StageId =
  | 'trying' | 'trimester-1' | 'trimester-2' | 'trimester-3'
  | 'newborn' | 'infant' | 'age-1' | 'age-2' | 'age-3'
  | 'preschool' | 'elementary';

export interface StageInfo {
  id: StageId;
  label: string;
  shortLabel: string;
  description: string;
  emoji: string;
  group: 'prenatal' | 'baby' | 'toddler' | 'kids';
}

export const stages: StageInfo[] = [
  { id: 'trying', label: '妊活・妊娠したかも', shortLabel: '妊活', description: '基礎体温、妊娠検査薬、産婦人科選び', emoji: '🤰', group: 'prenatal' },
  { id: 'trimester-1', label: '妊娠初期（〜15週）', shortLabel: '妊娠初期', description: 'つわり対策、初診、母子手帳', emoji: '🌱', group: 'prenatal' },
  { id: 'trimester-2', label: '妊娠中期（16〜27週）', shortLabel: '妊娠中期', description: '安定期、性別判明、マタニティウェア', emoji: '🌸', group: 'prenatal' },
  { id: 'trimester-3', label: '妊娠後期（28週〜）', shortLabel: '妊娠後期', description: '出産準備、入院準備、陣痛対策', emoji: '👶', group: 'prenatal' },
  { id: 'newborn', label: '新生児（0〜3ヶ月）', shortLabel: '新生児', description: '産後ケア、授乳、沐浴、お宮参り', emoji: '🍼', group: 'baby' },
  { id: 'infant', label: '乳児（4〜11ヶ月）', shortLabel: '0歳後半', description: '離乳食、ハイハイ、夜泣き対策', emoji: '🧸', group: 'baby' },
  { id: 'age-1', label: '1歳', shortLabel: '1歳', description: 'つかまり立ち、歩行、断乳/卒乳', emoji: '🎂', group: 'toddler' },
  { id: 'age-2', label: '2歳', shortLabel: '2歳', description: 'イヤイヤ期、トイトレ、言葉の発達', emoji: '🎨', group: 'toddler' },
  { id: 'age-3', label: '3歳', shortLabel: '3歳', description: 'プレ幼稚園、社会性、お箸デビュー', emoji: '🌈', group: 'toddler' },
  { id: 'preschool', label: '4〜6歳（園児）', shortLabel: '4-6歳', description: '幼稚園・保育園、習い事、入学準備', emoji: '🎒', group: 'kids' },
  { id: 'elementary', label: '小学生', shortLabel: '小学生', description: '学習習慣、友達関係、自立', emoji: '📚', group: 'kids' },
];

export const stageGroups = [
  { id: 'prenatal', label: '産前', emoji: '🤱' },
  { id: 'baby', label: '赤ちゃん', emoji: '👶' },
  { id: 'toddler', label: '幼児', emoji: '🧒' },
  { id: 'kids', label: 'キッズ', emoji: '🎓' },
] as const;

export function getStage(id: string): StageInfo | undefined {
  return stages.find(s => s.id === id);
}

export function getStageLabel(id: string): string {
  return getStage(id)?.label ?? id;
}
