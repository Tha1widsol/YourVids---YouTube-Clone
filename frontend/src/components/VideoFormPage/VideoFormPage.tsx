import axios from 'axios'
import React,{useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import {FileProps, VideoProps} from '../../app/types/files'
import { setProgress } from '../../features/videos/videoProgress'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { fetchCurrentChannel } from '../../features/channels/currentChannel'
import ReactPlayer from 'react-player'
import ChunkedUploady from "@rpldy/chunked-uploady";
import UploadButton from "@rpldy/upload-button"

export default function VideoFormPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [title, setTitle] = useState({value: '', maxlength: 100})
  const [video, setVideo] = useState<VideoProps>({value: '', name: '', length: ''})
  const [thumbnail, setThumbnail] = useState<FileProps>({value: '', name: ''})
  const [description, setDescription] = useState({value: '', maxlength: 5000})
  const [category, setCategory] = useState({value: 'Any'})
  const [videoFilePath, setVideoFilePath] = useState('')

  const convertHMS = (secs: number) => {
    if (secs < 3600) return new Date(secs * 1000).toISOString().substring(14, 19)
    return new Date(secs * 1000).toISOString().substring(11, 16)
}
  
function handleSetFile(e: React.ChangeEvent<HTMLInputElement>){
    if (!e.target.files) return
    const vid = document.createElement('video')
    setVideoFilePath(URL.createObjectURL(e.target.files[0]));
    setVideo({value: e.target.files[0], name: e.target.files[0].name, length: '0'})
    const fileURL = URL.createObjectURL(e.target.files[0])
    vid.src = fileURL
    vid.ondurationchange = () => {
     setVideo(prev => {return{...prev, length: convertHMS(vid.duration)}})
    }
   
 }

  function handleSubmitForm(e: React.SyntheticEvent){
    e.preventDefault()
    const requestOptions = {
      headers: {'Content-Type': 'multipart/form-data'},
      onUploadProgress: (progressEvent: ProgressEvent) => {
        const {loaded, total} = progressEvent
        let percent = Math.floor(loaded * 100 / total)
        dispatch(setProgress(percent))
      }
    }

    let form = new FormData()
    form.append('title', title.value)
    form.append('video', video.value, video.name)
    if (thumbnail.value) form.append('thumbnail', thumbnail.value, thumbnail.name)
    form.append('description', description.value)
    form.append('category', category.value)
    form.append('length', video.length)
    
    navigate('/videos')
  }

  return (
      <>
          <h1>Upload/Create a video:</h1>
          {videoFilePath ? <p>Preview:</p> : null}
          <ReactPlayer url = {videoFilePath} width = '100%' height = '100%' controls/>
          <hr className = 'mt-0-mb-4'/>
          <label id = 'video'><p>Video file:</p></label>
          <input type = 'file' id = 'video' accept = 'video/*,.mkv'  onChange = {handleSetFile}/>
          <ChunkedUploady
            method = 'POST'
            destination={{ url: `/api/createVideo`, headers: {"x-custom": "123" } }}
            chunkSize = {1000 * 1024}
            inputFieldName={'file'}>
            <UploadButton/>
          </ChunkedUploady>
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
      </>
  )
}
