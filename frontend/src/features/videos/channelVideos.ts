import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface VideosProps{
    values: [{
        id: number
        title: string
        description: string
        views: number
        likes: number
        dislikes: number
        thumbnail: string
        category: string
        length: string
        pathName: string
        created_at: string
    }]
}

export const channelVideosApi = createApi({
    reducerPath: 'channelVideosApi',
    baseQuery: fetchBaseQuery({baseUrl: '/api/'}),
    endpoints: (builder) => ({
        getChannelVideos: builder.query<VideosProps['values'], string>({
            query: (id) => `getChannelVideos?id=${id}`
        })
    })
})

export const {useGetChannelVideosQuery} = channelVideosApi