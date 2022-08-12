// Auto-generated at https://app.quicktype.io/

export interface ExpenseFormResult {
  sum: Sum;
  currencyId: CurrencyID;
  placeId: PlaceID;
  comment: ExpenseFormResultComment;
  categoryId: CategoryID;
  tags: Tags;
  recordDate: ExpenseFormResultRecordDate;
  ignoreNotification: IgnoreNotification;
}

export interface CategoryID {
  categoryId: ID;
}

export interface ID {
  type: string;
  selected_option: SelectedOption;
}

export interface SelectedOption {
  text: Text;
  value: string;
}

export interface Text {
  type: string;
  text: string;
  emoji: boolean;
}

export interface ExpenseFormResultComment {
  comment: SumClass;
}

export interface SumClass {
  type: string;
  value: string;
}

export interface CurrencyID {
  currencyId: ID;
}

export interface IgnoreNotification {
  ignoreNotification: TagsClass;
}

export interface TagsClass {
  type: string;
  selected_options: SelectedOption[];
}

export interface PlaceID {
  placeId: ID;
}

export interface ExpenseFormResultRecordDate {
  recordDate: RecordDateRecordDate;
}

export interface RecordDateRecordDate {
  type: string;
  selected_date: null | string;
}

export interface Sum {
  sum: SumClass;
}

export interface Tags {
  tags: TagsClass;
}
