import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ChannelProps } from './channels';

export const channelApi = createApi({
    reducerPath: 'channelAPI',
    baseQuery: fetchBaseQuery({baseUrl: '/api/'}),
    endpoints: (builder) => ({
        getChannel: builder.query<ChannelProps['values'], string | number | undefined>({
            query: (id) => `getChannel?id=${id}`
        })
    })
})

export const {useGetChannelQuery} = channelApi