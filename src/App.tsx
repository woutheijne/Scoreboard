import './App.scss'
import './Ranking/Ranking'
import './Menu/Menu'
import Ranking from './Ranking/Ranking'
import Menu from './Menu/Menu'
import { useEffect, useState } from 'react'
import Timer from './Timer'
import Updating from './Updating/Updating'

interface responseType {
  status: number;
  message: string;
  data?: Record<string,Record<string,string>>
}

function App() {
  const [page, setPage] = useState<string>('menu')
  const [lastPage, setlastPage] = useState<string>('mario-bak')
  const [editActive, setEditActive] = useState<boolean>(false)

  function handleMenuClick() {
    if (page == 'menu') setPage(lastPage)
    else setlastPage(page); setPage('menu')
    setlastPage(page)
    setPage('menu')
    setIsActive(false)
  }

  function handleEditClick() {
    setEditActive(true)
  }

  const [data, setData] = useState<Record<string, Record<string,string>> | null>(null)
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null)
  const [games, setGames] = useState<string[]>([])
  const [syncData, setSyncData] = useState<boolean>(false)

  useEffect(() => {
    const fetchData = async () => {
      console.log('Starting synchronization')
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
        console.log(err)
        setError(err instanceof Error ? err.message : 'error occured')
      } finally {
        setLoading(false)
        console.log('Finished syncronization')
      }
    };

    fetchData();

  }, [syncData]);

  const setIsActive = Timer(setPage, games)

  return (
    <div className='page'>
      <div className="video-container"><video autoPlay muted loop playsInline> <source src="mario_kart.mp4" type="video/mp4" /></video></div>
      <img className='menu-img' src="logo.jpeg" alt="" onClick={handleMenuClick} />
      <img className='edit-img' src="edit.png" alt="" onClick={handleEditClick}/>
      {page == 'menu' ? <div className='menu-container'><Menu games={games} setPage={setPage} setIsActive={setIsActive} setSyncData={setSyncData}></Menu></div> : data && !error && !loading ? <div className='ranking-container'><Ranking name={page} scores={data[page]}></Ranking></div> : 'No data found'}
      {editActive ? <div className='updating-container'><Updating game={page} setEditActive={setEditActive} setSyncData={setSyncData}></Updating></div> : <></>}
    </div>
  )
}

export default App
