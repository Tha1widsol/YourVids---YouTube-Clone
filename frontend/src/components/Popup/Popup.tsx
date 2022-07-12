import React,{ReactNode} from 'react'
import './css/Popup.css'

export default function Popup({
    children,
    trigger,
    switchOff,
    modalOn = true
    }: 
    {
    trigger: boolean, 
    switchOff: () => void
    children: ReactNode
    modalOn?: boolean
    }
    ){
      
  return trigger ? (
      <div className = {modalOn ? 'modalBackground' : ''}>
          <div className = 'popup'>
              <div className = 'close' onClick = {switchOff}>&times;</div>
              {children}
          </div>
      </div>
  ): null
}