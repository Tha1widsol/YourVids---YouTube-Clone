import React,{useState} from 'react'
import axios from 'axios'

export default function PlaylistForm({popupOff}: {popupOff: () => void}) {
  const [title, setTitle] = useState({value: '', maxlength: 200})
  const [description, setDescription] = useState({value: '', maxlength: 500})
  const [visibility, setVisibility] = useState({value: 'Public'})

  function handleSubmit(e: React.SyntheticEvent){
    e.preventDefault()
    const requestOptions = {
      headers: {'Content-Type': 'multipart/form-data'}
    }

    let form = new FormData();
    form.append('title', title.value)
    form.append('description', description.value)
    form.append('visibility', visibility.value)
    
    axios.post('/api/createPlaylist',form, requestOptions)
    .then(response => {
      if (response.status === 200){
        console.log(response.data)
        popupOff()
      }
    })

    
  }

  return (
    <form className = 'popupForm' onSubmit = {handleSubmit}>
      <h2>Create a playlist:</h2>
      <label htmlFor = 'playlistTitle'><p>Title - {title.maxlength - title.value.length} characters remaining:</p></label>
      <input id = 'playlistTitle' value = {title.value} maxLength = {title.maxlength} onChange = {e => setTitle(prev => {return{...prev, value: e.target.value}})} placeholder = 'Playlist title...'/>
     
      <label htmlFor = 'playlistDescription' ><p>Description (Optional) - {description.maxlength - description.value.length} characters remaining:</p></label>  
      <textarea id = 'playlistDescription' value = {description.value}  onChange = {e => setDescription(prev => {return{...prev, value: e.target.value}})} placeholder = 'Playlist description...'/> 

      <label htmlFor = 'playlistVisibility'><p>Visibility:</p></label>
      <select id = 'playlistVisibility' onChange = {e => setVisibility(prev => {return{...prev, visibility: e.target.value}})}>
        <option value = 'Public'>Public</option>
        <option value = 'Private'>Private</option>
        <option value = 'Unlisted'>Unlisted</option>
      </select>

      <div className = 'row' style = {{justifyContent: 'space-between'}}>
         <button style = {{float: 'right'}}>Create</button>
         <button onClick = {popupOff}>Cancel</button>
      </div>

    </form>
  )
}
