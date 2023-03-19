import axios from 'axios'
import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom'
import {FileProps} from '../../app/types/files'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { editVideo } from '../../features/videos/channelVideos'

export default function VideoFormPage({currentID = 0, currentTitle = '', currentDescription = '', currentThumbnail = '', currentCategory = '', fileName = '',popupOff} : {currentID?: number, currentTitle?: string, currentDescription?: string, currentThumbnail?: string, currentCategory?: string, fileName?: string, popupOff: () => void}) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const currentChannel = useAppSelector(state => state.currentChannel)
  const [title, setTitle] = useState({value: currentTitle || fileName, maxlength: 100})
  const [thumbnail, setThumbnail] = useState<FileProps>({value: currentThumbnail, name: ''})
  const [description, setDescription] = useState({value: currentDescription || '', maxlength: 5000})
  const [category, setCategory] = useState({value: currentCategory || 'Any'})

  function handleSubmitForm(e: React.SyntheticEvent){
    e.preventDefault()

    const requestOptions = {
      headers: {'Content-Type': 'multipart/form-data'}
    }

    let form = new FormData()
    form.append('title', title.value)
    if (thumbnail.name) form.append('thumbnail', thumbnail.value, thumbnail.name)
    form.append('description', description.value)
    form.append('category', category.value)
    form.append('fileName', fileName)

    axios.post(`/api/postVideo?id=${currentID}`,form, requestOptions)
    .then(response => {
      if (response.status === 200) {
        popupOff()
        if (currentID){
            dispatch(editVideo({
              id: currentID,
              title: title.value,
              description: description.value,
              thumbnail: thumbnail.value,
              category: category.value
            }))
        }
        navigate('/videos')
       
      }
 
    })
  

  }

  return (
      <form onSubmit = {handleSubmitForm}>
          <label htmlFor = 'videoTitle'><p>Title - {title.maxlength - title.value.length} characters remaining:</p></label>
          <input type = 'text' id = 'videoTitle' className = 'longInput' value = {title.value} onChange = {e => setTitle(prev => {return{...prev, value: e.target.value}})} placeholder = 'Title...' maxLength = {title.maxlength}/>

          <label htmlFor = 'videoDescription'><p>Description (Optional) - {description.maxlength - description.value.length} characters remaining:</p></label>
          <textarea id = 'videoDescription' value = {description.value} onChange = {e => setDescription(prev => {return{...prev, value: e.target.value}})} placeholder = 'Description...' maxLength = {description.maxlength}/>

          <label htmlFor = 'thumbnail'><p>Thumbnail (Optional):</p></label>
          <input type = 'file' id = 'thumbnail' accept = 'image/*'  onChange = {e => {if (!e.target.files) return; setThumbnail({value: e.target.files[0], name: e.target.files[0].name})}}/>

          <label htmlFor = 'category'><p>Category:</p></label>
          <select id = 'category' onChange = {e => setCategory({value: e.target.value})} value = {category.value}>
            <option value = 'Any'>Any</option>
            <option value = 'Entertainment'>Entertainment</option>
            <option value = 'Education'>Education</option>
            <option value = 'Sports'>Sports</option>
            <option value = 'Comedy'>Comedy</option>
            <option value = 'Horror'>Horror</option>
            <option value = 'Romance'>Romance</option>
          </select>
      
          <button style = {{float: 'right'}}>Submit</button>
      </form>
  )
}
