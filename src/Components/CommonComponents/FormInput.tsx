import React from 'react';
export interface FormInputProps {
  name: string;
  type: string;
  placeholder?: string;
  className?: string,
  value: any,
  onChange: (value: React.FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  error?: string;
  label?: boolean |string;
  style?: string;
  checked?: boolean;
}



const FormInput: React.FC<FormInputProps> = (props): JSX.Element => {
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
      <input
        id={props.name}
        name={props.name}
        type={props.type}
        placeholder={props.placeholder}
        onChange={props.onChange}
        value={props.value}
        className={formClass}
        checked={props.checked}

      />
      {props.error && (
        <span className="error">{props.error}</span>
      )}

    </React.Fragment>
  )
}

export { FormInput };
export default FormInput;