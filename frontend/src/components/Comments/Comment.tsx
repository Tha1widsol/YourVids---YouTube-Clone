import React,{useState, useEffect} from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAppDispatch } from '../../app/hooks'
import { setCommentLikes, setCommentDislikes } from '../../features/comments/comments'
import { CommentProps } from '../../features/comments/types/CommentProps'
import './css/Comments.css'

export default function Comment({comment, parentChannelName = '', replyOn} : {comment: CommentProps, parentChannelName?: string, replyOn: () => void}) {
    const dispatch = useAppDispatch()
    const [liked, setLiked] = useState(false)
    const [disliked, setDisliked] = useState(false)

    function handleLikeComment(){
        setLiked(!liked)
        setDisliked(false)

        if (!liked){
            dispatch(setCommentLikes({
                id: comment.id,
                value: comment.likes + 1
            })) 

            if (disliked) dispatch(setCommentDislikes({
                id: comment.id,
                value: comment.dislikes - 1
            }))
            return
        }

        dispatch(setCommentLikes({
            id: comment.id,
            value: comment.likes - 1
        }))
    }

    function handleDislikeComment(){
        setDisliked(!disliked)
        setLiked(false)
        if (!disliked){
            dispatch(setCommentDislikes({
                id: comment.id,
                value: comment.dislikes + 1
            }))
            if (liked) dispatch(setCommentLikes({
                id: comment.id,
                value: comment.likes - 1
            }))
            return
        }
        dispatch(setCommentDislikes({
            id: comment.id,
            value: comment.dislikes - 1
        }))
    } 

  return (
        <span className = 'row' style = {{gap: '20px'}}>
            <Link to = {`/channel/${comment.channel?.id}`}>
                    {comment.channel?.logo ? <img className = 'logo' src = {`/storage/${comment.channel?.logo}`} alt = ''/> : <img className = 'logo' alt = ''/>}  
            </Link>

            <div>
                <Link to = {`/channel/${comment.channel?.id}`}>
                        <b style = {{fontWeight: 500}}>{comment.channel?.name}</b>
                </Link>
                    
                <p className = 'row' style = {{gap: '10px'}}>
                    {parentChannelName ? <b>@{parentChannelName}</b> : null}
                    <span>{comment.text}</span>
                </p>
        

                <div className = 'row likesDislikes'>
                    <i className = 'fa fa-thumbs-up' style = {liked ? {color: 'green'} : {}} onClick = {handleLikeComment}/>
                    <p>{comment.likes}</p>
                    <i className = 'fa fa-thumbs-down' style = {disliked ? {color: 'red'} : {}} onClick = {handleDislikeComment}/>
                    <p>{comment.dislikes}</p>
                    <button onClick = {replyOn}>Reply</button>
                </div>
            </div>

        </span>
  )
}
