import React from 'react'

export default function Errors({errors} : {errors : Array<string>}) {
  return (
    <div>
        {errors.map((error,index) => {
            return (
                <div style = {{color: 'red'}} key = {index}> 
              
                    <li>{error}</li>
                
                </div>
                )
        })}
    </div>
  )
}
