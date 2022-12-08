import { ChannelProps } from "../../channels/types/ChannelProps"

export interface CommentsProps{
    values:[{
        channel: ChannelProps['values']
        id: number
        video_id: number
        parent_id: number
        text: string
        likes: number
        dislikes: number
        created_at: string
        
        replies: [{
            channel: ChannelProps['values']
            id: number
            video_id: number
            parent_id: number
            text: string
            likes: number
            dislikes: number
            created_at: string
        }]
    }]
    status: '' | 'success' | 'loading' | 'rejected'
}

export interface CommentProps {
        channel: ChannelProps['values']
        id: number
        video_id: number
        parent_id: number
        text: string
        likes: number
        dislikes: number
        created_at: string
        
     
}