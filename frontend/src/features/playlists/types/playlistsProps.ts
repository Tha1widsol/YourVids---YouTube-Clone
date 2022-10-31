import { ChannelProps } from "../../channels/types/ChannelProps";
import { VideosProps } from "../../videos/types/VideoProps";

export interface PlaylistsProps{
    values: [{
        id: number
        channel: ChannelProps['values']
        title: string
        description: string
        views: number
        videoCount: number
        visibility: 'Public' | 'Private' | 'Unlisted'
        created_at: string
        videos: VideosProps['values']
    }],
    status: '' | 'success' | 'loading' | 'rejected'
}

export interface PlaylistProps{
    values: {
        id: number
        channel: ChannelProps['values']
        title: string
        description: string
        views: number
        videoCount: number
        visibility: 'Public' | 'Private' | 'Unlisted'
        created_at: string
        videos: VideosProps['values']
    },
    status: '' | 'success' | 'loading' | 'rejected'
}