import { ChannelProps } from "../../channels/types/ChannelProps"

export interface VideoProps{
    values: {
        channel: ChannelProps['values']
        id: number
        title: string
        description: string
        views: number
        likes: number
        dislikes: number
        thumbnail: string
        category: string
        length: string
        pathName: string
        created_at: string
    }
    status: '' | 'success' | 'loading' | 'rejected'
}

export interface VideosProps{
    values: [{
        channel: ChannelProps['values']
        id: number
        title: string
        description: string
        views: number
        likes: number
        dislikes: number
        thumbnail: string
        category: string
        length: string
        pathName: string
        created_at: string
    }]
    status: '' | 'success' | 'loading' | 'rejected'
}

export interface LikedDislikedVideosProps{
    values: [{
        id: number
        liked: boolean
        disliked: boolean
        channel: ChannelProps['values']
        video: VideoProps['values']
        created_at: string
    }]
    status: '' | 'success' | 'loading' | 'rejected'
}
