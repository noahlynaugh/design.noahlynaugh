import React from 'react'

export default function ImageUrlPreview({url, name}) {
  if (!url) return null
  return (
    <img
      src={url}
      alt={name || 'Preview'}
      style={{objectFit: 'cover', width: '100%', height: '100%'}}
    />
  )
}