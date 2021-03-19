export interface SupplierList {
  id: number;
  supplier_name: string;
}

export interface ClinicList {
  id: number;
  clinic_name: string;
}

export interface CreatedByList {
  id: number;
  firstname: string;
  lastname: string;
}

export interface MdList {
  id: number;
  firstname: string;
  lastname: string;
}

export interface RequestPayload {
  supplier_id: number | string;
  clinic_id: number | string;
  order_placed_by: number | string;
  note: string;
  md_id: number | string;
  payment_term_type: string;
  last_4_digits_of_cc: string;
  purchase_order_items: Array<ProductInterface>
}

export interface ProductInterface {
  product_name?: string;
  product_id: number | string;
  units: number | string;
  price_per_unit: number | string;
  tax?: number | string;
  total?: number | string;
  show?: boolean;
  isSearching?: boolean;
  error?: any;
}

export interface ProductInfo {
  id: number | string;
  product_name: string;
  price_per_unit: number | string;
}


export interface SupplierModel {
  supplier_name: string;
  supplier_email: Array<string>;
  supplier_phone: string;
  address_1: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  contact_person_firstname: string;
  contact_person_lastname: string;
  contact_person_phone: string;
  contact_person_email: string;
  distributor_name: string;
  ordering_phone: string;
  ordering_url: string;
  account_number: string;
  clinics: Array<SupplierClinicModel>
}

export interface SupplierClinicModel {
  clinic_id?: number | string;
  account_number?: string;
}

export interface CountryList {
  country_code: string;
  country_name: string;
}

export interface AllClinicModel {
  id: string | number;
  clinic_name: string;
  clinic_id?: number | string;
  account_number?: string;
}