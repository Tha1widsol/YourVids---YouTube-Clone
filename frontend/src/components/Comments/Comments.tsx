import React from 'react'
import { CommentsProps } from '../../features/comments/types/CommentProps'
import './css/Comments.css'

export default function Comments({comments}: {comments: CommentsProps['values']}) {
  return (
    <>
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
                          <button>Reply</button>
                       </div>
                   </div>
      
                </span>
             
             </div>
          )
        })}
    </>
  )
}
