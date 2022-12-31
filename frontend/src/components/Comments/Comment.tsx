import React,{useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { setCommentLikes, setCommentDislikes } from '../../features/comments/comments'
import { CommentProps } from '../../features/comments/types/CommentProps'
import './css/Comments.css'
import axios from 'axios'

    export default function Comment({comment, likedDislikedComments, parentChannelName = '', replyOn} : {comment: CommentProps, likedDislikedComments: Record<number | string,{comment_id: number, liked: boolean, disliked: boolean}>, parentChannelName?: string, replyOn: () => void}) {
        const dispatch = useAppDispatch()
        const [liked, setLiked] = useState(false)
        const [disliked, setDisliked] = useState(false)
        const user = useAppSelector(state => state.user)
        
        useEffect(() => {
            if (user.isLoggedIn){
                if (!(comment.id in likedDislikedComments)) return

                if (likedDislikedComments[comment.id].liked){
                    setLiked(true)
                    return
                }
                setDisliked(true)
            }
        },[dispatch, likedDislikedComments, user.isLoggedIn, comment.id])
    
        function handleLikeComment(){
            setLiked(!liked)
            setDisliked(false)

            if (!liked){
                dispatch(setCommentLikes({
                    root_id: comment.root_id,
                    id: comment.id,
                    value: comment.likes + 1
                })) 
                
                axios.post(`/api/likeComment?id=${comment.id}`)
                .then(response => {
                    if (response.status !== 200){
                        dispatch(setCommentLikes({
                            root_id: comment.root_id,
                            id: comment.id,
                            value: comment.likes - 1
                        })) 
                    }
                })

                if (disliked) dispatch(setCommentDislikes({
                    root_id: comment.root_id,
                    id: comment.id,
                    value: comment.dislikes - 1
                }))

                return
            }

            dispatch(setCommentLikes({
                root_id: comment.root_id,
                id: comment.id,
                value: comment.likes - 1
            }))

            axios.delete(`/api/comment/removeLikeDislike?id=${comment.id}`)
            .then(response => {
                if (response.status !== 200){
                    dispatch(setCommentLikes({
                        root_id: comment.root_id,
                        id: comment.id,
                        value: comment.likes + 1
                    }))
                }
            })
        }

        function handleDislikeComment(){
            setDisliked(!disliked)
            setLiked(false)

            if (!disliked){
                dispatch(setCommentDislikes({
                    root_id: comment.root_id,
                    id: comment.id,
                    value: comment.dislikes + 1
                }))

                axios.post(`/api/dislikeComment?id=${comment.id}`)
                .then(response => {
                    if (response.status !== 200){
                        dispatch(setCommentDislikes({
                            root_id: comment.root_id,
                            id: comment.id,
                            value: comment.dislikes - 1
                        }))
                    }
                })

                if (liked) dispatch(setCommentLikes({
                    root_id: comment.root_id,
                    id: comment.id,
                    value: comment.likes - 1
                }))
                return
            }

            dispatch(setCommentDislikes({
                root_id: comment.root_id,
                id: comment.id,
                value: comment.dislikes - 1
            }))

            axios.delete(`/api/comment/removeLikeDislike?id=${comment.id}`)
            .then(response => {
                if (response.status !== 200){
                    dispatch(setCommentDislikes({
                        root_id: comment.root_id,
                        id: comment.id,
                        value: comment.dislikes + 1
                    }))
                }
            })
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
