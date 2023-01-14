import React,{ useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CommentsProps } from '../../features/comments/types/CommentProps'
import Popup from '../Popup/Popup'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import './css/Comments.css'
import { addReply, fetchVideoComments, removeComment } from '../../features/comments/comments'
import Comment from './Comment'
import KebabMenu from '../KebabMenu/KebabMenu'
import axios from 'axios'

export default function CommentsSection({comments, videoChannelID}: {comments: CommentsProps, videoChannelID?: number}) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector(state => state.user)
  const [popup, setPopup] = useState<{reply: boolean, comment: {id: number, rootID: number | null}, delete: {trigger: boolean, commentID: number}}>({reply: false, comment: {id: 0, rootID: null}, delete: {trigger: false, commentID: 0}})
  const [showReplies, setShowReplies] = useState<{commentIDList: Array<number>}>({commentIDList: []})
  const [reply, setReply] = useState('')
  const currentChannel = useAppSelector(state => state.currentChannel)
  const {videoID} = useParams()
  const [likedDislikedComments, setLikedDislikedComments] = useState({})
  const [loaded, setLoaded] = useState(false)
  const [dropdown, setDropdown] = useState<number | null>(null)
 
  useEffect(() => {
    if (!user.isLoggedIn) {
      setLoaded(true)
      return
    }

    axios.get(`/api/getLikedDislikedComments`)
    .then(response => {
      if (response.status === 200){
          const comments = response.data
          setLikedDislikedComments(comments)
          setLoaded(true)
      }
    })
    
  },[dispatch, loaded, user.isLoggedIn])

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

    .catch(error => {
      if (error.response.status === 401) navigate('/login')
    })
  }

 function handleCloseReply(commentID: number){
    let newCommentIDList = [...showReplies.commentIDList]
    let index = newCommentIDList.indexOf(commentID)
    newCommentIDList.splice(index, 1)
    setShowReplies({commentIDList: newCommentIDList})
 }

 function handleRemoveComment(commentID: number){
  axios.delete(`/api/removeComment?id=${commentID}`)
  .then(response => {
    if (response.status === 200) {
      dispatch(removeComment(commentID))
      setPopup(prev => ({...prev, delete: {...prev.delete, trigger: false}}))
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

      <Popup trigger = {popup.delete.trigger} switchOff = {() =>setPopup(prev => ({...prev, delete: {...prev.delete, trigger: false}}))}>
        <div style = {{textAlign: 'center'}}>
            <p>Are you sure you want to delete this comment?</p>
              <button onClick = {() => handleRemoveComment(popup.delete.commentID)}>Yes</button>
              <button onClick = {() => setPopup(prev => ({...prev, delete: {...prev.delete, trigger: false}}))}>Cancel</button>
        </div>
      </Popup>

        {loaded ? 
        <>
          {comments.values?.map((comment, index) => {
            return (
              <div className = 'comments' key = {index}>
                <div className = 'row' style = {{justifyContent: 'space-between'}}>
                  <Comment comment = {comment} likedDislikedComments = {likedDislikedComments} replyOn = {() => setPopup(prev => ({...prev, reply: true, comment: {id: comment.id, rootID: comment.id}}))}/> 
                  <KebabMenu current = {dropdown} many = {true} index = {index} switchOn = {() => setDropdown(index)} switchOff = {() => setDropdown(null)}>
                      <button className = 'dropdownBtn redText'>Report</button>
                      {videoChannelID === currentChannel.values?.id || currentChannel.values?.id === comment.channel.id ? <button className = 'dropdownBtn redText' onClick = {() =>{setPopup(prev => ({...prev, delete: {...prev.delete, trigger: true, commentID: comment.id}})); setDropdown(null)}}>Delete</button> : null}
                  </KebabMenu>
                </div>
              
                <div className = 'replies'>
                  {showReplies.commentIDList.includes(comment.id) ? 
                      <>
                          {comment.replies.map((reply, index) => {
                            return (
                                <div key = {index}>
                                  <Comment comment = {reply} likedDislikedComments = {likedDislikedComments} parentChannelName = {reply.parent_id !== comment.id ? reply.parent?.channel.name : ''} replyOn = {() => setPopup(prev => ({...prev, reply: true, comment: {id: reply.id, rootID: comment.id}}))}/>
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
        : <p>Loading...</p>}
    </>
  )
}
