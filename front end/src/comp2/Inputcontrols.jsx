// import React from 'react'

const InputControls = (props) => {
  return (
    <div>
      <label
       className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-n-3'
      >
        {props.label}
      </label>
      <input 
        type={props.type || 'text'}
        className='flex h-10 w-full rounded-xl border border-input bg-n-7 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-n-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-n-1'
        {...props}/>
    </div>
  )
}

export default InputControls