import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ChannelProps } from './channels';

export const currentChannelApi = createApi({
    reducerPath: 'currentChannelAPI',
    baseQuery: fetchBaseQuery({baseUrl:' /api/'}),
    endpoints: (builder) => ({
        getCurrentChannel: builder.query<ChannelProps['values'], null>({
            query: () => 'getCurrentChannel'
        })
    })
})

export const {useGetCurrentChannelQuery} = currentChannelApi