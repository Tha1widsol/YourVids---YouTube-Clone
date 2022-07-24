import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
interface ChannelProps{
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
    }
}

interface ChannelsProps{
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
    }]
}

export const channelsApi = createApi({
    reducerPath: 'channelsAPI',
    baseQuery: fetchBaseQuery({baseUrl: '/api/'}),
    endpoints: (builder) => ({
        getUserChannels: builder.query<ChannelsProps['values'], null>({
            query: () => 'userChannels'
        })
    })
})

export const channelApi = createApi({
    reducerPath: 'channelAPI',
    baseQuery: fetchBaseQuery({baseUrl: '/api/'}),
    endpoints: (builder) => ({
        getChannel: builder.query<ChannelProps['values'], string>({
            query: (id) => `getChannel?id=${id}`
        })
    })
})

export const {useGetUserChannelsQuery} = channelsApi
export const {useGetChannelQuery} = channelApi