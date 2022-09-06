import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ChannelsProps } from '../channels/channels';

export const subscribersApi = createApi({
    reducerPath: 'subscribersAPI',
    baseQuery: fetchBaseQuery({baseUrl: '/api/'}),
    endpoints: (builder) => ({
        getSubscribers: builder.query<ChannelsProps['values'], string | number | undefined>({
            query: (id) => `getSubscribers?id=${id}`
        })
    })
})

export const {useGetSubscribersQuery} = subscribersApi