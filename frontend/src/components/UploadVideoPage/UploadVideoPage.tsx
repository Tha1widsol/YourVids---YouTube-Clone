import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player'
import ChunkedUploady from "@rpldy/chunked-uploady";
import UploadButton from "@rpldy/upload-button"
import {VideoProps} from '../../app/types/files'

export default function UploadVideoPage() {
    const navigate = useNavigate()
    const [videoFilePath, setVideoFilePath] = useState('')
    const [video, setVideo] = useState<VideoProps>({value: '', name: '', length: ''})

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


     
  return (
    <div style = {{textAlign: 'center'}}>
        <h1>Upload/Create a video:</h1>
        {videoFilePath ? <p>Preview:</p> : null}
        <ReactPlayer url = {videoFilePath} width = '100%' height = '100%' controls/>
      
        <ChunkedUploady
        method = 'POST'
        destination={{ url: `/api/uploadVideo`, headers: {"x-custom": "123" } }}
        chunkSize = {100 * 1024 * 1024}
        inputFieldName={'file'}>
        <UploadButton />
        </ChunkedUploady>
    </div>
  )
}
