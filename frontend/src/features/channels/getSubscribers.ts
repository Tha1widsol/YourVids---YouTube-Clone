import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ChannelsProps } from './types/ChannelProps';

export const channelSubscribersApi = createApi({
    reducerPath: 'channelSubscribersAPI',
    baseQuery: fetchBaseQuery({baseUrl: '/api/'}),
    endpoints: (builder) => ({
        getSubscribers: builder.query<ChannelsProps['values'], string | number | undefined>({
            query: (id) => `getSubscribers?id=${id}`
        })
    })
})

export const {useGetSubscribersQuery} = channelSubscribersApi