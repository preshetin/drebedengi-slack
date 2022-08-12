// Auto-generated at https://app.quicktype.io/

export interface MoveFormResult {
  sum: Sum;
  currencyId: CurrencyID;
  fromPlaceId: FromPlaceID;
  placeId: PlaceID;
  comment: MoveFormResultComment;
  recordDate: MoveFormResultRecordDate;
}

export interface MoveFormResultComment {
  comment: SumClass;
}

export interface SumClass {
  type: string;
  value: string;
}

export interface CurrencyID {
  currencyId: ID;
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

export interface FromPlaceID {
  fromPlaceId: ID;
}

export interface PlaceID {
  placeId: ID;
}

export interface MoveFormResultRecordDate {
  recordDate: RecordDateRecordDate;
}

export interface RecordDateRecordDate {
  type: string;
  selected_date: null | string;
}

export interface Sum {
  sum: SumClass;
}
