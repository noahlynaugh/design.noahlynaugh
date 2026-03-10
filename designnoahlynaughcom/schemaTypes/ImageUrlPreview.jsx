import React from 'react'

export default function ImageUrlPreview({url}) {
  if (!url) return null
  return (
    <img
      src={url}
      alt=""
      style={{width: '100%', height: '100%', objectFit: 'cover'}}
    />
  )
}
