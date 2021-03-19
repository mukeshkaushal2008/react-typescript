export interface InterfaceUserData {
  id: number | string,
  firstname: string,
  lastname?: string,
  email_id?: string
}

export interface InterfaceUserResponse extends InterfaceUserData {
  status: number,
  message: string,
  data: any
}

export interface InterfaceUserState {
  page: number,
  pagesize: number,
  sortby?: string,
  sortorder?:string,
  term?:string,
  status?: string,
  role_id?: string
}