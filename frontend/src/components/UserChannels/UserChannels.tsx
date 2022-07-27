import React,{useState, useRef} from 'react'
import {Link} from 'react-router-dom'
import Popup from '../Popup/Popup'
import Errors from '../Messages/Errors'
import {FileProps} from '../../app/types/files'
import {useGetUserChannelsQuery} from '../../features/channels/channels'
import './css/UserChannels.css'
import axios from 'axios'

export default function UserChannels() {
  const [popup, setPopup] = useState({create: false, ref: useRef<null | HTMLDivElement>(null)})
  const [name, setName] = useState({value: '', isValid: false, errorMsg: 'Name field is required'})
  const [description, setDescription] = useState({value: '', maxChars: 500})
  const [logo, setLogo] = useState<FileProps>({value: '', name:''})
  const [banner, setBanner] = useState<FileProps>({value: '', name:''})
  const [errors, setErrors] = useState<Array<string>>([])
  const channels = useGetUserChannelsQuery(null)

  const validateForm = () => {
    let isValid = true
    if (!name.value.length) {
      setErrors([name.errorMsg])
      isValid = false
    }
    return isValid
  }

  function handleSubmit(e: React.SyntheticEvent){
    e.preventDefault()

    if (!validateForm()){
      const channelName = document.getElementById('popupTop')
      channelName?.scrollIntoView()
      return
    }

    const requestOptions = {
      headers: {'Content-Type': 'multipart/form-data'}
    }

    let form = new FormData()
    form.append('name', name.value)
    form.append('description', description.value)
    if (logo.value) form.append('logo', logo.value, logo.name)
    if (banner.value) form.append('banner', banner.value, banner.name)

    axios.post('/api/createChannel',form, requestOptions)
    .then(response => {
      if (response.status === 200){
        setPopup(prev => {return{...prev, create: false}})
      }
    })
  }

  return (
    <div>
         <Popup trigger = {popup.create} switchOff = {() => setPopup(prev => {return{...prev, create: false}})}>
            <h2 id = 'popupTop'>Create a channel:</h2>
            <Errors errors = {errors}/>
            
            <form onSubmit = {handleSubmit}>
              <label htmlFor = 'channelName'><p>Name:</p></label>
              <input id = 'channelName' value = {name.value} onChange = {e => setName(prev => {return{...prev, value: e.target.value}})} placeholder = 'Name...'/>

              <label htmlFor = 'channelDescription'><p>Description (Optional):</p></label>
              <p className = 'smallGray'>Character remaining - {description.maxChars - description.value.length}</p>
              <textarea id = 'channelDescription' onChange = {e => setDescription(prev => {return{...prev, value: e.target.value}})}  value = {description.value} style = {{height: '80px', width: '65%'}} maxLength = {500} placeholder = 'Describe your channel...'/>

              <label htmlFor = 'channelLogo'><p>Logo (Optional):</p></label>
              <input type = 'file' accept = 'image/*' id = 'channelLogo' onChange = {e => {if (!e.target.files) return; setLogo({value: e.target.files[0], name: e.target.files[0].name})}}/>

              <label htmlFor = 'channelBanner'><p>Banner(Optional):</p></label>
              <input type = 'file' accept = 'image/*' id = 'channelBanner' onChange = {e => {if (!e.target.files) return; setBanner({value: e.target.files[0], name: e.target.files[0].name})}}/>

              <div style = {{marginTop: '20px'}}>
                <button>Submit</button>
                <button type = 'button' onClick = {() => setPopup(prev => {return{...prev, create: false}})}>Cancel</button>
              </div>
            </form>

         </Popup>

        <h1>Your channels</h1>
        <button onClick = {() => setPopup(prev => {return{...prev, create: true}})}>Add channel</button>

        <div style = {{display: 'flex', flexDirection: 'column', gap: '10px'}}>
        {channels.isSuccess ? 
          <>
            {channels.data?.map((channel, index) => {
            return (
                <div className = 'channelContainer' key = {index}>
                  <Link to = {`/channel/${channel.id}`}><h2 className = 'link disable-select'>{channel.name}</h2></Link>
                  <p style = {{fontSize: 'small', color: 'gray'}}>Creation date - {channel.created_at}</p>
                  <p>Subscribers - {channel.subscribers}</p>
                  <p>Total views - {channel.views}</p>

                </div>
            )
          })}
          </>
        : channels.isLoading ? 
          <>
            <p>Loading...</p>
          </>
      : null}
        </div>
       
    </div>
  )
}
