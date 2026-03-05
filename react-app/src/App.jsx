import { MonitoringWallProvider } from './context/MonitoringWallContext'
import { HomePage } from './pages'

function App() {
  return (
    <MonitoringWallProvider>
      <HomePage />
    </MonitoringWallProvider>
  )
}

export default App
