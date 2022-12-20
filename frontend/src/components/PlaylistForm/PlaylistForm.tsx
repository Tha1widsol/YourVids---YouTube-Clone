import React,{useState} from 'react'
import { useParams } from 'react-router-dom'
import { useAppDispatch } from '../../app/hooks'
import { editPlaylist } from '../../features/playlists/playlist'
import { PlaylistProps } from '../../features/playlists/types/playlistsProps'
import axios from 'axios'

export default function PlaylistForm({playlist, popupOff}: {playlist?: PlaylistProps['values'], popupOff: () => void}) {
  const dispatch = useAppDispatch()
  const [title, setTitle] = useState({value: playlist?.title || '', maxlength: 200})
  const [description, setDescription] = useState({value: playlist?.description || '', maxlength: 500})
  const [visibility, setVisibility] = useState({value: playlist?.visibility || 'Public'})
  const {playlistID} = useParams()


  function handleSubmit(e: React.SyntheticEvent){
    e.preventDefault()

    let form = new FormData();
    form.append('title', title.value)
    form.append('description', description.value)
    form.append('visibility', visibility.value)

    const requestOptions = {
      headers: {'Content-Type': 'multipart/form-data'}
    }

    axios.post(`/api/createPlaylist?id=${playlistID}`,form, requestOptions)
    .then(response => {
      if (response.status === 200){
        console.log(response.data)
        dispatch(editPlaylist({
          title: title.value,
          description: description.value,
          visibility: visibility.value,
        }))

         popupOff()
      }
    })

  }

  return (
    <form className = 'popupForm' onSubmit = {handleSubmit}>
      <h2>{playlistID ? 'Edit Playlist:' : 'Create Playlist:'}</h2>
      <label htmlFor = 'playlistTitle'><p>Title - {title.maxlength - title.value.length} characters remaining:</p></label>
      <input id = 'playlistTitle' value = {title.value} maxLength = {title.maxlength} onChange = {e => setTitle(prev => {return{...prev, value: e.target.value}})} placeholder = 'Playlist title...'/>
     
      <label htmlFor = 'playlistDescription' ><p>Description (Optional) - {description.maxlength - description.value.length} characters remaining:</p></label>  
      <textarea id = 'playlistDescription' value = {description.value}  onChange = {e => setDescription(prev => {return{...prev, value: e.target.value}})} placeholder = 'Playlist description...'/> 

      <label htmlFor = 'playlistVisibility'><p>Visibility:</p></label>
      <select id = 'playlistVisibility' value = {visibility.value} onChange = {e => setVisibility(prev => {return{...prev, value: e.target.value}})}>
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
