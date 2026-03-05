import { useMonitoringWall } from '../../hooks/useMonitoringWall'
import { useMonitoringWallSimulations } from '../../hooks/useMonitoringWallSimulations'
import CameraTile from './CameraTile'
import styles from './MonitoringWall.module.css'

export default function MonitoringWall() {
  useMonitoringWallSimulations()

  const { layout, layoutOptions, tileCount, layoutIndex, setLayout } = useMonitoringWall()

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <h1 className={styles.title}>Monitoring Wall</h1>
        <div className={styles.layoutSwitcher}>
          <span className={styles.layoutLabel}>Layout:</span>
          {layoutOptions.map((opt, i) => (
            <button
              key={opt.label}
              type="button"
              className={styles.layoutBtn}
              data-active={layoutIndex === i}
              onClick={() => setLayout(i)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </header>

      <div
        className={styles.grid}
        style={{
          '--cols': layout.cols,
          '--rows': layout.rows,
        }}
      >
        {Array.from({ length: tileCount }, (_, i) => (
          <CameraTile key={i} tileIndex={i} />
        ))}
      </div>
    </div>
  )
}
