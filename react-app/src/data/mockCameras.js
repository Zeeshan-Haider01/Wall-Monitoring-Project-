/**
 * Mock camera data and API for the monitoring wall.
 * No backend - all data is simulated.
 */

/** @typedef {'online' | 'offline' | 'connecting'} CameraStatus */
/** @typedef {'person' | 'vehicle' | 'fire'} AlertType */

/**
 * Public sample videos (short, loop-friendly). Same URL can be reused per camera.
 * Using reliable public domain / test video URLs.
 */
const SAMPLE_VIDEO_URLS = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
]

export const CAMERA_NAMES = [
  'Entrance Gate',
  'Parking Lot',
  'Lobby',
  'Warehouse',
  'Loading Dock',
  'Office Hallway',
  'Rear Exit',
  'Server Room',
  'Main Corridor',
  'Reception',
  'Stairwell A',
  'Stairwell B',
  'Rooftop',
  'Basement',
  'East Wing',
  'West Wing',
]

/**
 * @returns {Array<{ id: string, name: string, status: CameraStatus, streamUrl: string }>}
 */
export function getMockCameras() {
  return CAMERA_NAMES.map((name, i) => ({
    id: `cam_${i + 1}`,
    name,
    status: /** @type {CameraStatus} */ (i % 3 === 0 ? 'offline' : 'online'),
    streamUrl: SAMPLE_VIDEO_URLS[i % SAMPLE_VIDEO_URLS.length],
  }))
}

/**
 * Simulate API fetch delay.
 * @param {number} ms
 * @returns {Promise<void>}
 */
export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Mock API: fetch available cameras.
 * @returns {Promise<Array<{ id: string, name: string, status: CameraStatus, streamUrl: string }>>}
 */
export async function fetchCameras() {
  await delay(300)
  return getMockCameras()
}
