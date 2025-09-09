"use client"

import React, { useCallback, useState } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'
import { Card, CardContent } from '../ui/card'
import { cn } from '@/lib/utils'
import { RenderEmptyState, RenderErrorState } from './render-state'
import { toast } from 'sonner'
import { v4 as uuid } from "uuid";
interface UploadInterface {
    id: string | null;
    file: File | null;
    uploading: boolean;
    progress: number;
    key?: string;
    isDeleting: boolean;
    error: boolean;
    objectUrl?: string;
    fileType: "image" | "video"
}

export function Uploader() {
    const [fileState, setFileState] = useState<UploadInterface>({
        id: uuid(),
        file: null,
        uploading: false,
        progress: 0,
        isDeleting: false,
        error: false,
        fileType: "image"
    })


    const uploadFile = async (file: File) => {
        setFileState((prev) => ({
            ...prev,
            uploading: true
        }))


        try {
            //1. Get Presigned Url

            const presignedResponse = await fetch("/api/s3/upload", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fileName: file.name,
                    contentType: file.type,
                    size: file.size,
                    isImage: true
                })
            })

            if (!presignedResponse.ok) {
                setFileState((prev) => ({
                    ...prev,
                    uploading: false,
                    progress: 0,
                    error: true
                }))
            }

            const { signedUrl, key } = await presignedResponse.json();

            await new Promise<void>((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const percentage = Math.round((event.loaded / event.total) * 100);
                        setFileState((prev) => ({
                            ...prev,
                            progress: percentage
                        }))
                    }
                };


                xhr.onload = () => {
                    console.log(xhr.response, xhr.status)
                    if (xhr.status === 200 || xhr.status === 204) {
                        setFileState((prev) => ({
                            ...prev,
                            uploading: false,
                            progress: 100,
                            key: key
                        }))
                        toast.success("File uploaded successfully")
                        resolve();
                    } else {
                        setFileState((prev) => ({
                            ...prev,
                            uploading: false,
                            progress: 0,
                            error: true
                        }))
                        toast.error("Failed to upload file")
                        reject(new Error("Failed to upload file"));
                    }

                };

                xhr.onerror = () => {
                    console.log(xhr.response, xhr.status)
                    setFileState((prev) => ({
                        ...prev,
                        uploading: false,
                        progress: 0,
                        error: true
                    }))
                    toast.error("Failed to upload file")
                    reject(new Error("Failed to upload file"));
                };

                console.log(signedUrl, file)

                xhr.open("PUT", signedUrl);

                xhr.setRequestHeader("Content-Type", file.type);

                xhr.send(file);

            })
        } catch (error) {
            toast.error("Failed to upload file");
            setFileState((prev) => ({
                ...prev,
                uploading: false,
                progress: 0,
                error: true
            }))
        }
    }

    const onDrop = useCallback((acceptedFiles: File[]) => {
        console.log(acceptedFiles)
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setFileState({
                id: null,
                file: file,
                uploading: false,
                progress: 0,
                isDeleting: false,
                error: false,
                fileType: "image",
                objectUrl: URL.createObjectURL(file)
            })

            uploadFile(file);
        }
    }, [])

    function onDropRejecteds(fileRejections: FileRejection[]) {
        if (fileRejections.length > 0) {
            const toManyFiles = fileRejections.find(rejection => rejection.errors[0].code === "too-many-files");
            if (toManyFiles) {
                toast.error("You can only upload one file at a time")
            }

            const fileSizeTooBig = fileRejections.find(rejection => rejection.errors[0].code === "file-too-large");
            if (fileSizeTooBig) {
                toast.error("File size too big")
            }
        }
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone(
        {
            onDrop,
            accept: { "image/*": [] },
            maxFiles: 1,
            multiple: false,
            maxSize: 5 * 1024 * 1024,
            onDropRejected: onDropRejecteds
        }
    );


    function renderContent() {
        if (fileState.uploading) {
            return <h1>Uploading..</h1>
        }

        if (fileState.error) {
            return <RenderErrorState />
        }

        if (fileState.objectUrl) {
            return <h1>uploaded file</h1>
        }

        return <RenderEmptyState isDragActive={isDragActive} />
    }
    return (
        <Card {...getRootProps()} className={cn(
            "relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-64",
            isDragActive ? "border-primary bg-primary/10 border-solid" : "border-border hover:border-primary"
        )}>
            <CardContent className='flex justify-center items-center h-full w-full p-4'>
                <input {...getInputProps()} />
                {renderContent()}
            </CardContent>
        </Card>
    )
}