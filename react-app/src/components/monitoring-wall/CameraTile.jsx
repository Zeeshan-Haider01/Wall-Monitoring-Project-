import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useMonitoringWall } from '../../hooks/useMonitoringWall'
import styles from './CameraTile.module.css'

/**
 * @param {{ tileIndex: number }} props
 */
function CameraTile({ tileIndex }) {
  const {
    assignments,
    cameras,
    statuses,
    alerts,
    fullscreenTile,
    setFullscreenTile,
    assignCamera,
  } = useMonitoringWall()
  const [showPicker, setShowPicker] = useState(false)
  const videoRef = useRef(null)

  const cameraId = assignments[tileIndex] ?? null
  const camera = cameraId ? cameras.find((c) => c.id === cameraId) : null
  const status = camera ? (statuses[camera.id] ?? camera.status) : null
  const tileAlerts = camera ? alerts.filter((a) => a.cameraId === camera.id) : []
  const isFullscreen = fullscreenTile === tileIndex

  const handleFullscreen = useCallback(() => {
    setFullscreenTile(isFullscreen ? null : tileIndex)
  }, [tileIndex, isFullscreen, setFullscreenTile])

  useEffect(() => {
    if (!isFullscreen) return
    const onEsc = (e) => {
      if (e.key === 'Escape') setFullscreenTile(null)
    }
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [isFullscreen, setFullscreenTile])

  const handleTileClick = useCallback(() => {
    setShowPicker(true)
  }, [])

  const handleAssign = useCallback(
    (id) => {
      assignCamera(tileIndex, id)
      setShowPicker(false)
    },
    [tileIndex, assignCamera]
  )

  if (isFullscreen) {
    return (
      <div className={styles.fullscreenWrap} data-fullscreen>
        <div className={styles.fullscreenBackdrop} onClick={() => setFullscreenTile(null)} />
        <div className={styles.fullscreenContent}>
          <CameraTileContent
            camera={camera}
            status={status}
            tileAlerts={tileAlerts}
            videoRef={videoRef}
            isFullscreen
          />
          <button
            type="button"
            className={styles.fullscreenClose}
            onClick={() => setFullscreenTile(null)}
            aria-label="Exit fullscreen"
          >
            ✕
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={styles.tile}
      data-assigned={!!camera}
      onClick={handleTileClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleTileClick()}
      aria-label={camera ? `Camera: ${camera.name}` : 'Assign camera'}
    >
      {camera ? (
        <>
          <CameraTileContent
            camera={camera}
            status={status}
            tileAlerts={tileAlerts}
            videoRef={videoRef}
          />
          <button
            type="button"
            className={styles.fullscreenBtn}
            onClick={(e) => {
              e.stopPropagation()
              handleFullscreen()
            }}
            aria-label="Fullscreen"
          >
            ⛶
          </button>
        </>
      ) : (
        <div className={styles.placeholder}>
          <span>+ Assign camera</span>
        </div>
      )}
      {showPicker && (
        <CameraPicker
          cameras={cameras}
          onSelect={handleAssign}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  )
}

/**
 * @param {{ camera: { id: string, name: string, streamUrl: string } | null, status: string | null, tileAlerts: Array<{ id: string, type: string }>, videoRef: React.RefObject<HTMLVideoElement | null>, isFullscreen?: boolean }} props
 */
function CameraTileContent({ camera, status, tileAlerts, videoRef, isFullscreen }) {
  const latestAlert = tileAlerts[tileAlerts.length - 1]

  return (
    <>
      <div className={styles.header}>
        <span className={styles.name}>{camera?.name ?? '—'}</span>
        <StatusBadge status={status} />
      </div>
      <div className={styles.videoWrap}>
        {status === 'offline' && (
          <div className={styles.offline}>
            <span>Camera Offline</span>
            <span className={styles.retry}>Reconnecting…</span>
          </div>
        )}
        {status === 'connecting' && (
          <div className={styles.connecting}>
            <span className={styles.spinner} />
            <span>Connecting…</span>
          </div>
        )}
        {status === 'online' && (
          <video
            ref={videoRef}
            src={camera?.streamUrl}
            autoPlay
            muted
            loop
            playsInline
            className={styles.video}
          />
        )}
        {latestAlert && (
          <div className={styles.alertOverlay} data-type={latestAlert.type}>
            ⚠ {latestAlert.type.charAt(0).toUpperCase() + latestAlert.type.slice(1)} detected
          </div>
        )}
      </div>
      <div className={styles.footer}>
        Alerts: {tileAlerts.length === 0 ? 'None' : tileAlerts.length}
      </div>
    </>
  )
}

/** @param {{ status: string | null }} props */
function StatusBadge({ status }) {
  if (!status) return null
  return (
    <span className={styles.status} data-status={status}>
      {status}
    </span>
  )
}

/**
 * @param {{ cameras: Array<{ id: string, name: string }>, onSelect: (id: string) => void, onClose: () => void }} props
 */
function CameraPicker({ cameras, onSelect, onClose }) {
  return (
    <div className={styles.pickerBackdrop} onClick={onClose}>
      <div className={styles.picker} onClick={(e) => e.stopPropagation()}>
        <h3>Select camera</h3>
        <ul>
          {cameras.map((cam) => (
            <li key={cam.id}>
              <button type="button" onClick={() => onSelect(cam.id)}>
                {cam.name}
              </button>
            </li>
          ))}
        </ul>
        <button type="button" className={styles.pickerClose} onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  )
}

export default memo(CameraTile)
