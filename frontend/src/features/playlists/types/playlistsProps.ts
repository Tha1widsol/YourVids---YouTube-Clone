import { ChannelProps } from "../../channels/types/ChannelProps";

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
    }],
    status: '' | 'success' | 'loading' | 'rejected'
}