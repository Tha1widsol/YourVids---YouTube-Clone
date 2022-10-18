import React,{ReactNode} from 'react'
import './css/KebabMenu.css'

export default function KebabMenu({
    current, 
    many = false,
    index,
    children,
    switchOn,
    switchOff,
    }: 
    {
    current: number | boolean | null
    many?: boolean
    index?: number
    children: ReactNode
    switchOn: () => void
    switchOff: () => void
  }) {

  return (
    <div onMouseEnter = {switchOn} onMouseLeave = {switchOff}>
        <div className = 'kebabMenuIcon'/> 
        <div className = 'containerDropdown'>
            {(many && current === index) || (!many && current) ?
            <div className = 'containerDropdownContent'>
              {children}
            </div>
            : null}   
        </div>
    </div>
  )
}