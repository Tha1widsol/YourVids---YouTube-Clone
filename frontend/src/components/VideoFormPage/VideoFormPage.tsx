import React,{useState} from 'react'
import {FileProps} from '../../app/types/files'

export default function VideoFormPage() {
  const [title, setTitle] = useState({value: '', maxlength: 100})
  const [video, setVideo] = useState<FileProps>({value: '', name: ''})
  const [thumbnail, setThumbnail] = useState<FileProps>({value: '', name: ''})
  const [description, setDescription] = useState({value: '', maxlength: 5000})
  const [category, setCategory] = useState({value: ''})
  

  return (
    <div>
        <form>
            <h1>Upload/Create a video:</h1>
            <hr className = 'mt-0-mb-4'/>
            <label id = 'video'><p>Video file:</p></label>
            <input type = 'file' id = 'video' accept = 'video/*,.mkv'  onChange = {e => {if (!e.target.files) return; setVideo({value: e.target.files[0], name: e.target.files[0].name})}}/>

            <label htmlFor = 'videoTitle'><p>Title - {title.maxlength - title.value.length} characters remaining:</p></label>
            <input type = 'text' id = 'videoTitle' value = {title.value} onChange = {e => setTitle(prev => {return{...prev, value: e.target.value}})} placeholder = 'Title...' maxLength = {title.maxlength}/>

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
    </div>
  )
}
