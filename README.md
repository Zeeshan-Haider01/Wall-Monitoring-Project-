React + Vite
Smart Video Monitoring Wall
A frontend-only monitoring wall for viewing multiple camera feeds in a configurable grid (2×2, 3×3, 4×4). Cameras and alerts are simulated; no backend required.

Run the project
cd react-app
npm install
npm run dev
Open the URL shown in the terminal (e.g. http://localhost:5173).

Features
Layout: Switch between 2×2, 3×3, and 4×4 grids.
Camera assignment: Click an empty tile → choose a camera from the list.
Simulated feed: Each camera uses a sample video URL (HTML5 <video>).
Status: Online / Offline / Connecting, with random changes every 10–20s.
Alerts: Random person/vehicle/fire alerts every few seconds; overlay and count on tiles.
Fullscreen: Click ⛶ on a tile; press ESC to exit.
Offline handling: Offline tiles show “Camera Offline” and “Reconnecting…”.
Architecture
State: Single React context (MonitoringWallContext) with a reducer for layout, assignments, camera statuses, alerts, and fullscreen. No external state library.
Simulations: useMonitoringWallSimulations runs timers for status changes and random alerts; it dispatches into context so only affected tiles update.
Components: MonitoringWall (grid + layout switcher), CameraTile (video, status, alerts, fullscreen, camera picker). Tiles are memoized to limit re-renders.
Data: Mock cameras and sample video URLs in src/data/mockCameras.js; no API calls.
Styling: CSS modules per component; theme variables in index.css.
This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

@vitejs/plugin-react uses Babel (or oxc when used in rolldown-vite) for Fast Refresh
@vitejs/plugin-react-swc uses SWC for Fast Refresh
React Compiler
The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see this documentation.

Architecture notes

State: One React context + useReducer for layout index, tile→camera assignments, per-camera status overrides, alert list, and fullscreen tile. No Redux.

Simulations: useMonitoringWallSimulations() runs inside the grid; it sets timeouts/intervals and dispatches to context so only relevant tiles re-render when status or alerts change.

Separation: Mock data in data/, context in context/, simulations in hooks/, UI in components/monitoring-wall/. CameraTile is memoized to limit re-renders.

Performance: Up to 16 tiles; context updates only when layout, assignments, statuses, or alerts change. Alert list is trimmed to the last 50 entries.
