import './App.scss'
import './Ranking/Ranking'
import './Menu/Menu'
import Ranking from './Ranking/Ranking'
import Menu from './Menu/Menu'
import { useEffect, useState } from 'react'
import Timer from './Timer'
// import Updating from './Updating/Updating'

interface responseType {
  status: number;
  message: string;
  data?: {
    scores: Record<string,Record<string,string>>;
    types: Record<string, string>;
    backgrounds: Record<string,string>;
  } 
}
  

function App() {
  const [page, setPage] = useState<string>('menu')
  const [lastPage, setlastPage] = useState<string>('menu')

  function handleMenuClick() {
    if (page == 'menu') {setPage(lastPage)}
    else {setlastPage(page); setPage('menu')}
    setIsActive(false)
  }

  const [scoreData, setData] = useState<Record<string, Record<string,string>> | null>(null)
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null)
  const [games, setGames] = useState<{types:Record<string,string>,backgrounds:Record<string,string>}>({types:{},backgrounds:{}})
  const [syncData, setSyncData] = useState<boolean>(false)
  const [background, setBackground] = useState<string>('mario_kart.mp4')

  // useEffect(() => {
  //   setBackground()
  // },[page])

  useEffect(() => {
    const fetchData = async () => {
      // console.log('Starting synchronization')
      setLoading(true)
      try {
        const response = await fetch("https://script.google.com/macros/s/AKfycby9YuT6M7edvR95BGG3RS4G6ETLy6pqVMoSx4zvJ7Ysw9Q5gHV6xJwX7M_5OX_DNoL8/exec?req=Scores")

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
        console.log(respData)
        setData(respData.data.scores)
        setGames({types:respData.data.types,backgrounds:respData.data.backgrounds})
      } catch (err) {
        console.log(err)
        setError(err instanceof Error ? err.message : 'error occured')
      } finally {
        setLoading(false)
        // console.log('Finished syncronization')
      }
    };

    fetchData();

  }, [syncData]);

  const setIsActive = Timer(setPage, games.types)

  useEffect(() => {
    setBackground(getSrc())
  },[page])

  const isVideo = () => {
    // setBackground(getSrc)
    return background.endsWith('.mp4')
  }
  const getSrc = () => {
    const bg = games.backgrounds[page]
    return bg? bg :'mario_kart.mp4'
  }
  return (
    <div className='page'>
      <div className="video-container">
        {/* <video autoPlay muted loop playsInline><source type='video/mp4' src={background} onError={(e) => {(e.target as HTMLImageElement).src = 'mario_kart.mp4';}}/></video> */}
        {isVideo()? 
          <video autoPlay muted loop playsInline><source type='video/mp4' src={background} onError={(e) => {(e.target as HTMLImageElement).src = 'mario_kart.mp4';}}/></video>:
          <img src={background} onEmptied={(e) => {(e.target as HTMLImageElement).src = 'logo.jpeg';}} alt="" />
        }
      </div>
      <img className='menu-img' src="logo.jpeg" alt="" onClick={handleMenuClick} />
      {/* <img className='edit-img' src="edit.png" alt="" onClick={handleEditClick}/> */}
      {page == 'menu' ? <div className='menu-container'>
        <Menu loading={loading} games={games.types} setPage={setPage} setIsActive={setIsActive} setSyncData={setSyncData}></Menu></div> : 
          scoreData && !error && !loading ? 
            <div className='ranking-container'><Ranking setSyncData={setSyncData} name={page} tpe={games.types[page]} scores={scoreData[page]}></Ranking></div> : 
            'No data found'}
      {/* {editActive ? <div className='updating-container'><Updating game={page} setEditActive={setEditActive} setSyncData={setSyncData}></Updating></div> : <></>} */}
    </div>
  )
}

export default App
