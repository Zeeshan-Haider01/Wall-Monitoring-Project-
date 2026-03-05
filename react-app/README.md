# React + Vite

## Smart Video Monitoring Wall

A frontend-only monitoring wall for viewing multiple camera feeds in a configurable grid (2×2, 3×3, 4×4). Cameras and alerts are simulated; no backend required.

### Run the project

```bash
cd react-app
npm install
npm run dev
```

Open the URL shown in the terminal (e.g. http://localhost:5173).

### Features

- **Layout**: Switch between 2×2, 3×3, and 4×4 grids.
- **Camera assignment**: Click an empty tile → choose a camera from the list.
- **Simulated feed**: Each camera uses a sample video URL (HTML5 `<video>`).
- **Status**: Online / Offline / Connecting, with random changes every 10–20s.
- **Alerts**: Random person/vehicle/fire alerts every few seconds; overlay and count on tiles.
- **Fullscreen**: Click ⛶ on a tile; press **ESC** to exit.
- **Offline handling**: Offline tiles show “Camera Offline” and “Reconnecting…”.

### Architecture

- **State**: Single React context (`MonitoringWallContext`) with a reducer for layout, assignments, camera statuses, alerts, and fullscreen. No external state library.
- **Simulations**: `useMonitoringWallSimulations` runs timers for status changes and random alerts; it dispatches into context so only affected tiles update.
- **Components**: `MonitoringWall` (grid + layout switcher), `CameraTile` (video, status, alerts, fullscreen, camera picker). Tiles are memoized to limit re-renders.
- **Data**: Mock cameras and sample video URLs in `src/data/mockCameras.js`; no API calls.
- **Styling**: CSS modules per component; theme variables in `index.css`.

---

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
