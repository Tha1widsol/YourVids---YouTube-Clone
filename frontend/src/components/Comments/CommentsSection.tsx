import React,{useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import { CommentsProps } from '../../features/comments/types/CommentProps'
import Popup from '../Popup/Popup'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import './css/Comments.css'
import { addReply, fetchVideoComments } from '../../features/comments/comments'
import Comment from './Comment'
import axios from 'axios'

export default function CommentsSection({comments}: {comments: CommentsProps['values']}) {
  const dispatch = useAppDispatch()
  const [popup, setPopup] = useState<{reply: boolean, comment: {id: number, rootID: number | null}}>({reply: false, comment: {id: 0, rootID: null}})
  const [showReplies, setShowReplies] = useState<{commentIDList: Array<number>}>({commentIDList: []})
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
    if (popup.comment.rootID != null) form.append('root_id', String(popup.comment.rootID))
    form.append('video_id', videoID || '')
  
    axios.post(`/api/postReply`,form, requestOptions)
    .then(response => {
      if (response.status === 200){
        const r = response.data.reply
        dispatch(addReply(r))
        dispatch(fetchVideoComments(videoID))
        setPopup(prev => {return{...prev, reply: false}})
        setShowReplies(prev => {return{...prev, commentIDList: [...prev.commentIDList, popup.comment.id]}})
        setReply('')
      }
    })
    
  }

 function handleCloseReply(commentID: number){
    let newCommentIDList = [...showReplies.commentIDList]
    let index = newCommentIDList.indexOf(commentID)
    newCommentIDList.splice(index, 1)
    setShowReplies({commentIDList: newCommentIDList})
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
              <Comment comment = {comment} replyOn = {() => setPopup(prev => ({...prev, reply: true, comment: {id: comment.id, rootID: comment.id}}))}/> 
               <div className = 'replies'>
                 {showReplies.commentIDList.includes(comment.id) ? 
                    <>
                        {comment.replies.map((reply, index) => {
                         return (
                            <div key = {index}>
                              <Comment comment = {reply} parentChannelName = {reply.parent_id !== comment.id ? reply.parent?.channel.name : ''} replyOn = {() => setPopup(prev => ({...prev, reply: true, comment: {id: reply.id, rootID: comment.id}}))}/>
                            </div>
                         ) 
                        })}
                        <button onClick = {() => handleCloseReply(comment.id)}>Close replies</button>
                    </>
                    : comment.replies?.length ? <button onClick = {() => setShowReplies(prev => {return{...prev, commentIDList: [...prev.commentIDList, comment.id]}})}>Show replies</button> : null}

                 </div>
                
            </div>
        
          )
        })}
    </>
  )
}
