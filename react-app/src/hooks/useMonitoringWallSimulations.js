import { useEffect } from 'react'
import { useMonitoringWall } from './useMonitoringWall'

/** @type {Array<'online' | 'offline' | 'connecting'>} */
const STATUSES = ['online', 'offline', 'connecting']

/** @type {Array<'person' | 'vehicle' | 'fire'>} */
const ALERT_TYPES = ['person', 'vehicle', 'fire']

function randomBetween(min, max) {
  return min + Math.random() * (max - min)
}

/**
 * Runs status and alert simulations. Call once inside MonitoringWallProvider.
 */
export function useMonitoringWallSimulations() {
  const { assignments, setCameraStatus, addAlert, clearAlert } = useMonitoringWall()

  // Status changes every 10–20 seconds for assigned cameras
  useEffect(() => {
    const assignedCameraIds = [...new Set(Object.values(assignments).filter(Boolean))]
    if (assignedCameraIds.length === 0) return

    const scheduleNext = (cameraId) => {
      const delayMs = randomBetween(10000, 20000)
      return setTimeout(() => {
        const status = STATUSES[Math.floor(Math.random() * STATUSES.length)]
        setCameraStatus(cameraId, status)
        scheduleNext(cameraId)
      }, delayMs)
    }

    const timeouts = assignedCameraIds.map(scheduleNext)
    return () => timeouts.forEach(clearTimeout)
  }, [assignments, setCameraStatus])

  // Random alerts every few seconds for assigned cameras; auto-clear after 4s
  useEffect(() => {
    const assignedCameraIds = [...new Set(Object.values(assignments).filter(Boolean))]
    if (assignedCameraIds.length === 0) return

    const interval = setInterval(() => {
      const cameraId = assignedCameraIds[Math.floor(Math.random() * assignedCameraIds.length)]
      const type = ALERT_TYPES[Math.floor(Math.random() * ALERT_TYPES.length)]
      const alert = addAlert(cameraId, type)
      if (alert?.id) setTimeout(() => clearAlert(alert.id), 4000)
    }, randomBetween(3000, 7000))

    return () => clearInterval(interval)
  }, [assignments, addAlert, clearAlert])

  return null
}
