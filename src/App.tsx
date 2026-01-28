import './App.scss'
import './Ranking/Ranking'
import './Menu/Menu'
import Ranking from './Ranking/Ranking'
import Menu from './Menu/Menu'
import { useEffect, useState } from 'react'
import Timer from './Timer'

interface responseType {
  status: number;
  message: string;
  data?: Record<string,Record<string,string>>
}

function App() {
  const [page, setPage] = useState<string>('menu')
  const [lastPage, setlastPage] = useState<string>('mario-bak')
  function handleClick() {
    if (page == 'menu') setPage(lastPage)
    else setlastPage(page); setPage('menu')
    setlastPage(page)
    setPage('menu')
    setIsActive(false)
  }

  const [data, setData] = useState<Record<string, Record<string,string>> | null>(null)
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null)
  const [games, setGames] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbyGGt_GnoLCxPby5KJUwOBqi9YPe8ZJGHh4Khv1qSRJ9hK7-Q_kwW77odl9hEq48DKN/exec")

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const respData: responseType = await response.json()

        if (respData.status !== 200) {
          throw new Error(respData.message)
        }

        if (!respData.data) {
          return new Error('no data returned')
        }
        setData(respData.data)
        setGames(Object.keys(respData.data))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'error occured')
      } finally {
        setLoading(false)
      }
    };

    fetchData();

  }, []);

  const setIsActive = Timer(setPage, games)

  return (
    <div className='page'>
      <div className="video-container"><video autoPlay muted loop playsInline> <source src="mario_kart.mp4" type="video/mp4" /></video></div>
      <img className='menu-img' src="logo.jpeg" alt="" onClick={handleClick} />
      {page == 'menu' ? <div className='menu-container'><Menu games={games} setPage={setPage} setIsActive={setIsActive}></Menu></div> : data && !error && !loading ? <div className='ranking-container'><Ranking name={page} scores={data[page]}></Ranking></div> : 'No data found'}
    </div>
  )
}

export default App
