import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { VideosProps } from './channelVideos';

export const homeVideosApi = createApi({
    reducerPath: 'homeVideosApi',
    baseQuery: fetchBaseQuery({baseUrl: '/api/'}),
    endpoints: (builder) => ({
        getHomeVideos: builder.query<VideosProps['values'], null>({
            query: () => `getVideos`
        })
    })
})

export const {useGetHomeVideosQuery} = homeVideosApi