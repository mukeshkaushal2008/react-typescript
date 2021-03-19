
import React, { useState } from 'react'

const Counter: React.FC = (props): JSX.Element => {

  const [counter, setCounter] = useState<number>(0);
  const handleClick = (type: number): void => {
    if(type === 1){
      setCounter(counter + 1);
    }
    else{
      setCounter((counter > 0) ? (counter - 1) : 0);
    }
    
  }
  return (
    <div>
      Lets Start With Counter
      <h1>Counter is {counter}</h1>
      <button className="btn btn-success" onClick={(): void => handleClick(1)}>Click me</button>
      <button className="btn btn-success" onClick={(): void => handleClick(0)}>Click me</button>
    </div>
  )
}

export default Counter;
