export interface ChannelProps{
    values:
    {
    id: number
    name: string
    description: string
    subscribers: number
    views: number
    logo: string
    banner: string
    created_at: string
    active: boolean
    }
    status: '' | 'success' | 'loading' | 'rejected'
}

export interface ChannelsProps{
    values:
    [{
    id: number
    name: string
    description: string
    subscribers: number
    views: number
    logo: string
    banner: string
    created_at: string
    active: boolean
    }]
    status: '' | 'success' | 'loading' | 'rejected'
}
