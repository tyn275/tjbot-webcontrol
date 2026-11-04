import type { FC } from 'react'

export const App: FC = () => {
  return (
    <div className="app-root">
      <header>
        <h1>TJBot Web Control</h1>
        <p>Hệ thống điều khiển robot Raspberry Pi 4 qua MQTT</p>
      </header>
    </div>
  )
}

export default App
