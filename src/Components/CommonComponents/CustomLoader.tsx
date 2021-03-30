import React from "react";
import { Facebook } from 'react-content-loader';

export interface Loader {
  span?: number;
  loading: boolean | string;
  type?: string;
}

const CustomLoader: React.FC<Loader> = (props): JSX.Element => {
    return (
    <React.Fragment>
      {props.loading && props.type != "table" && <Facebook
        backgroundColor="hsla(0,0%,100%,.8)"
        foregroundColor={'#999'}
        {...props}
      >
      </Facebook>}

      {props.loading && props.type == "table" && <tr>
        <td colSpan={props.span} style={{ textAlign: 'center' }}>
          <Facebook
            backgroundColor="hsla(0,0%,100%,.8)"
            foregroundColor={'#999'}
            {...props}
          >
          </Facebook>

        </td>
      </tr>
      }
    </React.Fragment>
  )
}

export default CustomLoader;
export { CustomLoader };