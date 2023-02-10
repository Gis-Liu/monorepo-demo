export interface BaseResponse<T> {
  code: number;
  data: T;
  msg: string;
}

export interface PageData<T> {
  res: T[];
  total: number;
}

export interface SampleLabelTree {
  id: string;
  label: string;
  num: number;
  children?: SampleLabelTree[];
}

export type SourceType = "verify" | "difficult";
