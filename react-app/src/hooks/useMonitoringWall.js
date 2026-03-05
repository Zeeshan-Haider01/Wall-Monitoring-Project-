import { useContext } from 'react'
import { MonitoringWallContext } from '../context/MonitoringWallContext'

export function useMonitoringWall() {
  const ctx = useContext(MonitoringWallContext)
  if (!ctx) throw new Error('useMonitoringWall must be used within MonitoringWallProvider')
  return ctx
}
