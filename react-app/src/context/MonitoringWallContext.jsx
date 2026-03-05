import { createContext, useCallback, useContext, useMemo, useReducer } from 'react'
import { getMockCameras } from '../data/mockCameras'

/** @typedef {'online' | 'offline' | 'connecting'} CameraStatus */
/** @typedef {'person' | 'vehicle' | 'fire'} AlertType */

/**
 * @typedef {Object} AlertEvent
 * @property {string} cameraId
 * @property {AlertType} type
 * @property {string} timestamp
 * @property {string} id
 */

const LAYOUTS = [
  { cols: 2, rows: 2, label: '2×2' },
  { cols: 3, rows: 3, label: '3×3' },
  { cols: 4, rows: 4, label: '4×4' },
]

function layoutTileCount(layoutIndex) {
  const { cols, rows } = LAYOUTS[layoutIndex]
  return cols * rows
}

const initialState = {
  layoutIndex: 0,
  cameras: getMockCameras(),
  /** tile index -> camera id (or null if unassigned) */
  assignments: {},
  /** camera id -> CameraStatus (overrides initial) */
  statuses: {},
  /** active alerts: AlertEvent[] (recent only, trim when many) */
  alerts: [],
  /** which tile is fullscreen (tile index or null) */
  fullscreenTile: null,
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_LAYOUT':
      return { ...state, layoutIndex: Math.max(0, Math.min(2, action.payload)) }
    case 'ASSIGN_CAMERA':
      return {
        ...state,
        assignments: { ...state.assignments, [action.payload.tileIndex]: action.payload.cameraId },
      }
    case 'SET_STATUS':
      return {
        ...state,
        statuses: { ...state.statuses, [action.payload.cameraId]: action.payload.status },
      }
    case 'ADD_ALERT':
      return {
        ...state,
        alerts: [...state.alerts.slice(-49), action.payload],
      }
    case 'CLEAR_ALERT':
      return {
        ...state,
        alerts: state.alerts.filter((a) => a.id !== action.payload),
      }
    case 'SET_FULLSCREEN':
      return { ...state, fullscreenTile: action.payload }
    default:
      return state
  }
}

export const MonitoringWallContext = createContext(null)

export function MonitoringWallProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const setLayout = useCallback((index) => dispatch({ type: 'SET_LAYOUT', payload: index }), [])
  const assignCamera = useCallback(
    (tileIndex, cameraId) => dispatch({ type: 'ASSIGN_CAMERA', payload: { tileIndex, cameraId } }),
    []
  )
  const setCameraStatus = useCallback(
    (cameraId, status) => dispatch({ type: 'SET_STATUS', payload: { cameraId, status } }),
    []
  )
  const addAlert = useCallback((cameraId, type) => {
    const payload = {
      id: `alert_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      cameraId,
      type,
      timestamp: new Date().toISOString(),
    }
    dispatch({ type: 'ADD_ALERT', payload })
    return payload
  }, [])
  const clearAlert = useCallback((id) => dispatch({ type: 'CLEAR_ALERT', payload: id }), [])
  const setFullscreenTile = useCallback(
    (tileIndex) => dispatch({ type: 'SET_FULLSCREEN', payload: tileIndex }),
    []
  )

  const tileCount = layoutTileCount(state.layoutIndex)
  const layout = LAYOUTS[state.layoutIndex]

  const value = useMemo(
    () => ({
      ...state,
      layout,
      layoutOptions: LAYOUTS,
      tileCount,
      setLayout,
      assignCamera,
      setCameraStatus,
      addAlert,
      clearAlert,
      setFullscreenTile,
    }),
    [
      state,
      layout,
      tileCount,
      setLayout,
      assignCamera,
      setCameraStatus,
      addAlert,
      clearAlert,
      setFullscreenTile,
    ]
  )

  return (
    <MonitoringWallContext.Provider value={value}>
      {children}
    </MonitoringWallContext.Provider>
  )
}
