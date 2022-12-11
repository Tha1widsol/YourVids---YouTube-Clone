import React from 'react'
import { Link } from 'react-router-dom'
import { CommentProps } from '../../features/comments/types/CommentProps'
import './css/Comments.css'

export default function Comment({comment, parentChannelName = '', replyOn} : {comment: CommentProps, parentChannelName?: string, replyOn: () => void}) {
  return (
        <>
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
                            <i className = 'fa fa-thumbs-up'/>
                            <p>{comment.likes}</p>
                            <i className = 'fa fa-thumbs-down'/>
                            <p>{comment.dislikes}</p>
                            <button onClick = {replyOn}>Reply</button>
                        </div>
                </div>
            </span>
        </>
  )
}
