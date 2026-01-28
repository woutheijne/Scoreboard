import type React from "react";
import './Ranking.scss'
import 'bootstrap/dist/css/bootstrap.min.css';

interface game {
	name: string;
	scores: Record<string, string> | null
}


const Ranking: React.FC<game> = (game) => {
	if (!game.scores) return <div>No scores</div>
	const filtered = Object.entries(game.scores).filter(([_, value]) => value != "")
	let ranked = null

	const parseTime = (str: string) => {
		const l= str.split(':').map(Number).map((n, i) => {return n*(100**-i)})
		return l.reduce((a,b) => a+b, 0)
	}

	if (/^\d*:\d*[:\d*]*$/.test(Object.values(game.scores)[0])) {
		ranked = filtered.sort((a, b) => parseTime(a[1]) - parseTime(b[1]))
	} else {
		ranked = filtered.sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]))
	}

	const mapped = ranked.map(([name, value], index) => ({
		rank: index + 1,
		name: name,
		score: value
	}))
	
	return (

		<div className="scores">
			<h1>{game.name}</h1>
			{Object.entries(mapped).map(([, record],) => (
				<div className="score-row row record" key={record.name}>
					{record.rank == 1 ? null : <div className="rule"></div>}
					<div className="score-rank col-2">{record.rank + (record.rank == 1 ? 'st' : (record.rank == 2 ? 'nd' : 'th'))}</div>
					<div className="score-name col-5">{record.name}</div>
					<div className="col-2"></div>
					<div className="score-value col-3">{record.score}</div>
				</div>
			))}
		</div>)
}

export default Ranking