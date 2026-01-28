import './App.scss'
import './Ranking/Ranking'
import './Menu/Menu'
import Ranking from './Ranking/Ranking'

function App() {
  return (
    <div className='page'>
      <div className="video-container"><video autoPlay muted loop playsInline> <source src="mario_kart.mp4" type="video/mp4"/></video></div>
      <div className='ranking-container'><Ranking name='bierspuit'></Ranking></div>
    </div>
  )
}

export default App
