import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
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

export const {useGetUserChannelsQuery} = channelsApi

