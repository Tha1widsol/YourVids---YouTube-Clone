import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface ChannelProps{
    values:
    [{
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
        getUserChannels: builder.query<ChannelProps['values'], null>({
            query: () => 'userChannels'
        })
    })
})

export const {useGetUserChannelsQuery} = channelsApi