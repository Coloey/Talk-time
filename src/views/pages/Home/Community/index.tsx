import React, { useState, useEffect } from 'react'
export default function Community({ socket }) {
    useEffect(() => {
        socket.on('post', (data) => {
            console.log(data)
        })
    }, [])
    return (
        <div>
            community
        </div>
    )
}