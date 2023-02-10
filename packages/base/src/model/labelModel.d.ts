export interface Label {
  label: string;
  code: string;
  classifier: string;
  color: string;
  parent: string;
  level: number;
  plant: boolean;
  mapping: string;
}

export interface LabelTree extends Label {
  children?: LabelTree[];
}
