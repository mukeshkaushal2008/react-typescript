import React from "react";

export interface NoRecordProps {
  colspan?: number;
}


const NoRecordFound: React.FC<NoRecordProps> = (props): JSX.Element => {

  return (
    <React.Fragment>
      <tr>
        <td colSpan={props.colspan} style={{ textAlign: 'center' }}>
          {<b>No data found</b>}
        </td>
      </tr>
    </React.Fragment>
  )
}

export default NoRecordFound;
export { NoRecordFound };