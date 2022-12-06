import React,{useState} from 'react'
import { useParams } from 'react-router-dom'
import { CommentsProps } from '../../features/comments/types/CommentProps'
import Popup from '../Popup/Popup'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import './css/Comments.css'
import { addReply } from '../../features/comments/comments'
import axios from 'axios'

export default function Comments({comments}: {comments: CommentsProps['values']}) {
  const dispatch = useAppDispatch()
  const [popup, setPopup] = useState({reply: false, comment: {id: 0, channelID: 0}})
  const [showReplies, setShowReplies] = useState(false)
  const [reply, setReply] = useState('')
  const currentChannel = useAppSelector(state => state.currentChannel)
  const {videoID} = useParams()

  function handleSubmit(e: React.SyntheticEvent){
    e.preventDefault()
  
    const requestOptions = {
      headers: {'Content-Type':'application/json', 'Accept':'application/json'}
    }

    let form = new FormData()
    form.append('text', reply)
    form.append('comment_id', String(popup.comment.id) || '')
    form.append('channel_id', String(currentChannel.values.id) || '')
    form.append('replyToChannel_id', String(popup.comment.channelID) || '')
    form.append('video_id', videoID || '')

    axios.post(`/api/postReply`,form, requestOptions)
    .then(response => {
      if (response.status === 200){
        const r = response.data.reply
        dispatch(addReply(r))
        setPopup(prev => {return{...prev, reply: false}})
      }
    })
    
  }


  return (
    <>
      <Popup trigger = {popup.reply} switchOff = {() => setPopup(prev => {return{...prev, reply: false}})} modalOn = {false}>
        <form className = 'popupForm' onSubmit = {handleSubmit}>
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
                          <button onClick = {() => setPopup(prev => ({...prev, reply: true, comment: {...prev, id: comment.id, channelID: comment.channel.id}}))}>Reply</button>
                       </div>
                  
                  {showReplies ? 
                  <div>
                      {comment.replies.map((reply, index) => {
                      return (
                          <div key = {index}>
                            <b style = {{fontWeight: 500}}>{reply.channel?.name}</b>
                            <p>{reply.text}</p>
                              <div className = 'row likesDislikes'>
                                <i className = 'fa fa-thumbs-up'/>
                                <p>{reply.likes}</p>
                                <i className = 'fa fa-thumbs-down'/>
                                <p>{reply.dislikes}</p>
                                <button onClick = {() => setPopup(prev => ({...prev, reply: true, comment: {...prev, id: reply.id, channelID: reply.channel.id}}))}>Reply</button>
                              </div>
                          </div>
                      )
                      })}
                      <button onClick = {() => setShowReplies(false)}>Close</button>
                  </div>
                  : comment.replies.length ? <button onClick = {() => setShowReplies(true)}>Show replies</button> : null}
                 
                   </div>
      
                </span>

              
         
                
             </div>
          )
        })}
    </>
  )
}
