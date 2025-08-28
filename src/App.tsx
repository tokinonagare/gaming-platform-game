import React from 'react'

const App: React.FC = () => (
  <div style={{padding: '20px', color: 'white', textAlign: 'center'}}>
    <h1>🎮 游戏服务</h1>
    <div style={{display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginTop: '30px'}}>
      {['🏎️ 赛车游戏', '🧩 益智游戏', '⚔️ 动作游戏', '🎯 射击游戏'].map(game => (
        <div key={game} style={{background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '12px', cursor: 'pointer'}}>
          {game}
        </div>
      ))}
    </div>
    <div style={{marginTop: '20px', fontSize: '14px', opacity: 0.8}}>
      ⚡ Powered by Rsbuild
    </div>
  </div>
)

export default App