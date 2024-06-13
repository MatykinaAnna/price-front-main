export interface PeriodItem {
  id: number | null;
  date_since: string | null;
  date_to: string | null;
  is_draft: number;
  staff_id: number;
  timestamp: string;
  price_list_item: number;
  price_items: {
    article_unit_item_id: number;
    price_results: {
      value: number;
      staff_id: number;
      is_last: number;
      complex_item_id: number | null;
      division_id: number;
    }[];
  }[];
}

export interface DivisionsItem {
  division_id: number;
  division_name: string;
  division_order_num: number;
  district_id: number;
  district_name: string;
  city_id: number;
  city_name: string;
}

export interface PriceItem {
  id: number;
  article_unit_item_id: number;
  article_unit_item_name: number | null;
  article_item_name: string;
  product_item_name: string;
  is_disabled: number;
  timestamp: string;
}

export interface PriceResultItem {
  id: number;
  value: number;
  staff_id: number;
  is_last: number;
  timestamp: string;
  complex_item_id: number | null;
  price_list_result: number;
  price_item: number;
  division: number;
  price_list_result_id: number;
}

export interface ConfirmWindowProps {
  text: string;
  onTrickClick: (clickBtn: string) => void;
}
