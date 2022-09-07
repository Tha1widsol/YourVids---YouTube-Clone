import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface VideoProps{
    values: {
        channel: {
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
        id: number
        title: string
        channel_id: number
        description: string
        views: number
        likes: number
        dislikes: number
        thumbnail: string
        category: string
        length: string
        pathName: string
        created_at: string
    }
}

export const videoApi = createApi({
    reducerPath: 'videoAPI',
    baseQuery: fetchBaseQuery({baseUrl: '/api/'}),
    endpoints: (builder) => ({
        getVideo: builder.query<VideoProps['values'], string | number | undefined>({
            query: (id) => `getVideo?id=${id}`
        })
    })
})

export const {useGetVideoQuery} = videoApi