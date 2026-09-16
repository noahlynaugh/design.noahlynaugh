import React, {useMemo, useRef, useState, useCallback} from 'react'
import {set, useClient} from 'sanity'
import {Stack, Card, Button, Flex, Text} from '@sanity/ui'

// Build a CDN URL for a Sanity file asset reference: file-<assetId>-<ext>
function fileUrlFromRef(ref, client) {
  const m = /^file-([a-f0-9]+)-(\w+)$/.exec(ref || '')
  if (!m) return null
  const {projectId, dataset} = client.config()
  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${m[1]}.${m[2]}`
}

/**
 * Custom input for the `video` object. Renders the uploaded video with a
 * scrubber; "Use this frame as poster" grabs the current frame, uploads it
 * as an image asset, and writes it into the object's `poster` field.
 * The normal object fields (file uploader, poster) still render below.
 */
export function VideoPosterInput(props) {
  const {value, onChange, renderDefault} = props
  const client = useClient({apiVersion: '2024-01-01'})
  const videoRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')
  const [t, setT] = useState(0)
  const [dur, setDur] = useState(0)

  const url = useMemo(() => {
    const ref = value && value.file && value.file.asset && value.file.asset._ref
    return ref ? fileUrlFromRef(ref, client) : null
  }, [value, client])

  const onLoaded = () => setDur((videoRef.current && videoRef.current.duration) || 0)
  const onTime = () => setT((videoRef.current && videoRef.current.currentTime) || 0)
  const seek = (e) => {
    const v = Number(e.target.value)
    if (videoRef.current) videoRef.current.currentTime = v
    setT(v)
  }
  const step = (delta) => {
    if (!videoRef.current) return
    const v = Math.min(Math.max(0, videoRef.current.currentTime + delta), dur)
    videoRef.current.currentTime = v
    setT(v)
  }

  const capture = useCallback(async () => {
    const video = videoRef.current
    if (!video || !video.videoWidth) return
    setBusy(true)
    setStatus('Capturing frame…')
    try {
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
      const blob = await new Promise((res, rej) =>
        canvas.toBlob((b) => (b ? res(b) : rej(new Error('toBlob returned null'))), 'image/jpeg', 0.92),
      )
      setStatus('Uploading poster…')
      const asset = await client.assets.upload('image', blob, {
        filename: `poster-${Date.now()}.jpg`,
      })
      onChange(
        set({_type: 'image', asset: {_type: 'reference', _ref: asset._id}}, ['poster']),
      )
      setStatus(`Poster set from ${t.toFixed(2)}s ✓`)
    } catch (e) {
      const cors =
        e && (e.name === 'SecurityError' || /tainted/i.test(e.message))
          ? ' — the canvas is CORS-tainted. Add your Studio origin under manage.sanity.io → API → CORS Origins (Allow credentials), or serve the video CORS-enabled.'
          : ''
      setStatus('Failed: ' + (e.message || e) + cors)
    } finally {
      setBusy(false)
    }
  }, [client, onChange, t])

  return (
    <Stack space={3}>
      {url && (
        <Card padding={3} radius={2} shadow={1} tone="transparent">
          <Stack space={3}>
            <video
              ref={videoRef}
              src={url}
              crossOrigin="anonymous"
              controls
              playsInline
              onLoadedMetadata={onLoaded}
              onTimeUpdate={onTime}
              style={{width: '100%', borderRadius: 4, background: '#000', display: 'block'}}
            />
            <input
              type="range"
              min={0}
              max={dur || 0}
              step={0.01}
              value={t}
              onChange={seek}
              style={{width: '100%'}}
            />
            <Flex align="center" gap={2} wrap="wrap">
              <Button text="◄ frame" mode="ghost" fontSize={1} disabled={busy} onClick={() => step(-1 / 30)} />
              <Button text="frame ►" mode="ghost" fontSize={1} disabled={busy} onClick={() => step(1 / 30)} />
              <Button text="Use this frame as poster" tone="primary" disabled={busy} onClick={capture} />
              <Text size={1} muted>
                {t.toFixed(2)}s / {dur.toFixed(2)}s
              </Text>
            </Flex>
            {status && (
              <Text size={1} muted>
                {status}
              </Text>
            )}
          </Stack>
        </Card>
      )}
      {renderDefault(props)}
    </Stack>
  )
}

export default VideoPosterInput
