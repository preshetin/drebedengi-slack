// Auto-generated at https://app.quicktype.io/

export interface ExchangeFormResult {
    fromSum:        FromSum;
    fromCurrencyId: FromCurrencyID;
    sum:            Sum;
    currencyId:     CurrencyID;
    placeId:        PlaceID;
    comment:        ExchangeFormResultComment;
    recordDate:     ExchangeFormResultRecordDate;
}

export interface ExchangeFormResultComment {
    comment: FromSumClass;
}

export interface FromSumClass {
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

export interface FromCurrencyID {
    fromCurrencyId: ID;
}

export interface FromSum {
    fromSum: FromSumClass;
}

export interface PlaceID {
    placeId: ID;
}

export interface ExchangeFormResultRecordDate {
    recordDate: RecordDateRecordDate;
}

export interface RecordDateRecordDate {
    type:          string;
    selected_date: null | string;
}

export interface Sum {
    sum: FromSumClass;
}

