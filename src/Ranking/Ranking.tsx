import type React from "react";
import { useEffect, useState } from "react";
import './Ranking.scss'
import 'bootstrap/dist/css/bootstrap.min.css';

interface game {
	name: string;
}

interface responseType {
	status: number;
	message: string;
	data?: Record<string,string>;
}

const Ranking: React.FC<game> = (game) => {
	const [data, setData] = useState<Record<string, string> | null>(null)
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true)
			try {
				const response = await fetch("https://script.google.com/macros/s/AKfycbyGGt_GnoLCxPby5KJUwOBqi9YPe8ZJGHh4Khv1qSRJ9hK7-Q_kwW77odl9hEq48DKN/exec?game=" + game.name)
				
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

			} catch (err) {
				setError(err instanceof Error ? err.message: 'error occured')
			} finally {
				setLoading(false)
			}
		};

		if (game) fetchData();

	}, [game]);

	if (loading) return <p>Loading...</p>
	if (error) return <p>Error: {error}</p>
	if (data) {
		const filtered = Object.entries(data).filter(([_, value]) => value!="")
		let ranked = null
		const parseTimeSeconds = (str:string) => {
			const [m,s] = str.split(':').map(Number);
			return (m*60) + s;
		}
		if (game.name == 'bierspuit') {
			ranked = filtered.sort((a,b) => parseTimeSeconds(a[1]) - parseTimeSeconds(b[1]))
		} else {
			ranked = filtered.sort((a,b) => parseFloat(b[1]) - parseFloat(a[1]))
		}
		const mapped = ranked.map(([name, value], index) => ({
				rank: index + 1,
				name: name,
				score: value
			}))
		return (
		
		<div className="scores">
			{Object.entries(mapped).map(([, record], ) => (
				<div className="score-row row record" key={record.name}>
					{record.rank==1 ? null : <div className="rule"></div>}
					<div className="score-rank col-2">{record.rank + (record.rank==1 ? 'st' : (record.rank==2 ? 'nd' : 'th'))}</div>
					<div className="score-name col-5">{record.name}</div> 
					<div className="col-2"></div>
					<div className="score-value col-3">{record.score}</div>
				</div>
			))}
		</div>)
	}
}

export default Ranking