import { ChannelProps } from "../../channels/types/ChannelProps"

export interface CommentsProps{
    values:[{
        channel: ChannelProps['values']
        id: number
        videoID: number
        text: string
        likes: number
        dislikes: number
        created_at: string
    }]
    status: '' | 'success' | 'loading' | 'rejected'
}