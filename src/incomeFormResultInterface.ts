// Auto-generated at https://app.quicktype.io/

export default interface IncomeFormResult {
  sum:        Sum;
  currencyId: CurrencyID;
  placeId:    PlaceID;
  sourceId:   SourceID;
  comment:    IncomeFormResultComment;
  recordDate: IncomeFormResultRecordDate;
}

export interface IncomeFormResultComment {
  comment: SumClass;
}

export interface SumClass {
  type:  string;
  value: string;
}

export interface CurrencyID {
  currencyId: ID;
}

export interface ID {
  type:            string;
  selected_option: SelectedOption;
}

export interface SelectedOption {
  text:  Text;
  value: string;
}

export interface Text {
  type:  string;
  text:  string;
  emoji: boolean;
}

export interface PlaceID {
  placeId: ID;
}

export interface IncomeFormResultRecordDate {
  recordDate: RecordDateRecordDate;
}

export interface RecordDateRecordDate {
  type:          string;
  selected_date: null | string;
}

export interface SourceID {
  sourceId: ID;
}

export interface Sum {
  sum: SumClass;
}
