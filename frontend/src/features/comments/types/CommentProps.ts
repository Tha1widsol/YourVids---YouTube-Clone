import { ChannelProps } from "../../channels/types/ChannelProps"

export interface CommentsProps{
    values:[{
        channel: ChannelProps['values']
        id: number
        video_id: number
        parent_id: number
        root_id: number
        text: string
        likes: number
        dislikes: number
        created_at: string

        replies: [{
            channel: ChannelProps['values']
            id: 0,
            video_id: 0,
            parent_id: 0,

            parent: {
                channel: ChannelProps['values']
                id: 0,
                video_id: 0,
                parent_id: 0,
                root_id: 0,
                text: '',
                likes: 0,
                dislikes: 0,
                created_at: ''
            },

            root_id: 0,
            text: '',
            likes: 0,
            dislikes: 0,
            created_at: ''
        }]

    
    }]
    status: '' | 'success' | 'loading' | 'rejected'
}

export interface CommentProps {
        channel: ChannelProps['values']
        id: number
        video_id: number
        parent_id: number
        root_id: number
        text: string
        likes: number
        dislikes: number
        created_at: string
        
     
}