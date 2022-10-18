import React,{useState} from 'react'
import { Link } from 'react-router-dom'
import { VideosProps } from '../../features/videos/types/VideoProps'
import { useAppSelector } from '../../app/hooks'
import ReactPlayer from 'react-player'
import KebabMenu from '../KebabMenu/KebabMenu'
import './css/Videos.css'

export default function Videos({videos, isRow = true, isOwnVideos = false}: {videos: VideosProps['values'] | undefined, isRow?: boolean, isOwnVideos?: boolean}) {
  const videoProgress = useAppSelector(state => state.videoProgress.value)
  const [dropdown, setDropdown] = useState<number | null>(null)
  
  return videos ? (
    <>
       {videos?.length ? 
       <>
          <section className = {`videosContainer ${isRow ? 'row' : 'col'} `}>
                {videos?.map((video, index) =>{
                return (
                    <div className = 'videoContainer'>
                        <Link to = {`/video/${video.id}`} key = {index}>
                            <div className = 'thumbnailContainer'>
                            <ReactPlayer width = '200px' height = '100px' url = {video.pathName ? `/storage/${video.pathName}`: ''} light = {video.thumbnail ? `/storage/${video.thumbnail}` : false} playIcon = {<></>}/>
                            <p className = 'duration'>{video.length}</p>
                            </div>
                        </Link>
                    
                        <KebabMenu current = {dropdown} many = {true} index = {index} switchOn = {() => setDropdown(index)} switchOff = {() => setDropdown(null)}>
                            <button className = 'dropdownBtn'>Save</button>
                            <button className = 'dropdownBtn'>Add to playlist</button>
                        </KebabMenu>

                        <Link to = {`/video/${video.id}`} key = {index}>
                            <div className = 'description'>
                                <b>{video.title}</b>
                                <div className = 'smallGray'>
                                    <div className = 'logoSection row'>
                                    {video.channel?.logo ? <img className = 'videoChannelLogo' src = {`/storage/${video.channel?.logo}`} alt = ''/> : null}
                                        <p>{video.channel?.name}</p>
                                    </div>
                                
                                    {video.views} views
                                    - {video.created_at.slice(0, 10)}
                                </div>
                            </div>
                        </Link>
                    </div>
                )
                })}
                {isOwnVideos && videoProgress > 0 ? 
                    <div className = 'thumbnail skeleton center'>
                        <p>Progress - {videoProgress}</p>
                    </div>
                : null}
              
            </section>
        </>
        :
        <>
      
        <p>No videos posted...</p>
        {isOwnVideos ? <Link to = '/upload'><button>Upload</button></Link> : null}
        </>}
    </>
  ) : <p>Loading...</p>
  
}
