import React from 'react';

export interface FormSelectProps {
  name: string;
  placeholder?: string;
  className?: string,
  value: any,
  onChange: (value: React.FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  error?: string;
  style?: string;
  label?: boolean |string;
  options: Array<OptionModel>
}
export interface OptionModel {
  key: number | string;
  value: string;
}
const FormSingleSelect: React.FC<FormSelectProps> = (props): JSX.Element => {
  let formClass:string;
  if(props.error !== undefined){
    formClass = `${props.className} input-error`;
  }
  else{
    formClass = `${props.className}`;
  }
  return (
    <React.Fragment>
      { props.label !== false && <label htmlFor={props.name}>{props.label}</label>}
      <select
        id={props.name}
        name={props.name}
        onChange={props.onChange}
        value={props.value}
        className={formClass}
      >
        <option value="">Please select</option>
       
        {
          props.options && props.options.length > 0 && props.options.map(
            (val: any,index: number) => (
              <React.Fragment key={index}>
               <option value={val.key}>{val.value}</option>
              </React.Fragment>
            )
          )
        }
         </select>
      {props.error && (
        <span className="error">{props.error}</span>
      )}

    </React.Fragment>
  )
}
  export { FormSingleSelect };
  export default FormSingleSelect;