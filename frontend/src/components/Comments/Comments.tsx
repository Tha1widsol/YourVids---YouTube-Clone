import React,{useState} from 'react'
import { CommentsProps } from '../../features/comments/types/CommentProps'
import Popup from '../Popup/Popup'
import { useAppSelector } from '../../app/hooks'
import './css/Comments.css'
import axios from 'axios'

export default function Comments({comments}: {comments: CommentsProps['values']}) {
  const [popup, setPopup] = useState({reply: false, comment: {id: 0, channelID: 0, videoID: 0}})
  const [reply, setReply] = useState('')
  const currentChannel = useAppSelector(state => state.currentChannel)

  function handleSubmit(e: React.SyntheticEvent){
    const requestOptions = {
      headers: {'Content-Type': 'multipart/form-data'}
    }
    let form = new FormData()
    form.append('text', reply)
    form.append('comment_id', String(popup.comment.id))
    form.append('channel_id', String(currentChannel.values?.id))
    form.append('replyToChannel_id', String(popup.comment.channelID))
    form.append('video_id', String(popup.comment.videoID))
    
  }

  return (
    <>
      <Popup trigger = {popup.reply} switchOff = {() => setPopup(prev => {return{...prev, reply: false}})} modalOn = {false}>
        <form className = 'popupForm'>
            <textarea placeholder = 'Reply to this comment...' value = {reply} onChange = {e => setReply(e.target.value)}/>
            <div className = 'row' style = {{justifyContent: 'space-evenly'}}>
              <button>Reply</button>
              <button type = 'button' onClick = {() => setPopup(prev => {return{...prev, reply: false}})}>Cancel</button>
            </div>
        </form>
      </Popup>

        {comments.map((comment, index) => {
          return (
            <div className = 'comments' key = {index}>
                <span className = 'row' style = {{gap: '20px'}}>
                   {comment.channel?.logo ? <img className = 'logo' src = {`/storage/${comment.channel?.logo}`} alt = ''/> : <img className = 'logo' alt = ''/>}
                   <div>
                      <b style = {{fontWeight: 500}}>{comment.channel?.name}</b>
                      <p>{comment.text}</p>
                        <div className = 'row likesDislikes'>
                          <i className = 'fa fa-thumbs-up'/>
                          <p>{comment.likes}</p>
                          <i className = 'fa fa-thumbs-down'/>
                          <p>{comment.dislikes}</p>
                          <button onClick = {() => setPopup(prev => {return{...prev, reply: true, commentID: comment.id, channelID: comment.channel.id, videoID: comment.videoID}})}>Reply</button>
                       </div>
                   </div>
      
                </span>
             
             </div>
          )
        })}
    </>
  )
}
