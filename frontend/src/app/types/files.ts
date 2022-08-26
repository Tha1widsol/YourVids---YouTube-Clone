export interface FileProps{
    value: string | Blob
    name: string
}

export interface VideoProps extends FileProps{
    length: string | Blob
}
