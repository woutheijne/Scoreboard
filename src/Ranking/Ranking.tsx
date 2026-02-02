import type React from "react";
import './Ranking.scss'
import 'bootstrap/dist/css/bootstrap.min.css';
import Updating from "./Updating/Updating";
import { useState } from "react";

interface game {
	name: string;
	scores: Record<string,string>;
	tpe: string;
	setSyncData:React.Dispatch<React.SetStateAction<boolean>>
}


const Ranking: React.FC<game> = (game) => {
  	const [editActive, setEditActive] = useState<boolean>(false)
	const [record, setRecord] = useState<{name:string,rank:number,score:string}>({name:'',rank:0,score:''})

	let rev;
	let lst;
	let type;
	if (game.tpe !=='') {
		rev = game.tpe.startsWith('rev')
		lst = game.tpe.endsWith('list')
		type = game.tpe.split('_')[rev ? 1 : 0]
	} else {
		rev=false
		lst=false
		type='none'
	}
	
	// console.log(`Type: ${rev?'reverse ': ''}${type}${lst?' list':''}`)

	let flat
	
	if (lst) {
		flat = Object.entries(game.scores).map(([name,scores]) => scores.split(';').filter(Boolean).map(s => [name,s])).flat()
	} else {
		flat = Object.entries(game.scores)
	}
	
	const filtered = flat.filter(([_,v]) => v != '')
	let ranked:string[][] = []
	
	const parseTime = (str: string) => {
		const l= str.split(':').map(Number).map((n, i) => {return n*(100**-i)})
		return l.reduce((a,b) => a+b, 0)
	}
	
	if (type=='time') {
		ranked = filtered.sort((a,b) => rev ? parseTime(b[1]) - parseTime(a[1]) : parseTime(a[1]) - parseTime(b[1]))
	} else if (type=='count') {
		ranked = filtered.sort((a,b) => rev ? parseFloat(a[1]) - parseFloat(b[1]) : parseFloat(b[1]) - parseFloat(a[1]))
	}

	const mapped = ranked.slice(0,5).map(([name, value], index) => ({
		rank: index + 1,
		name: name,
		score: value
	}))

	function handleClick(record:{rank:number,name:string,score:string}) {
		setEditActive(true)
		setRecord(record)
	}
	
	return (

		<div className="scores">
			<img className='add-img' src="plus.png" alt="" onClick={()=>handleClick({rank:0,name:'',score:''})}/>
			<h1>{game.name}</h1>
			{game.scores? Object.entries(mapped).map(([, record],) => (
				<div className="score-row row record" key={record.rank}>
					{record.rank == 1 ? null : <div className="rule"></div>}
					<div className="score-rank col-2">{record.rank + (record.rank == 1 ? 'st' : (record.rank == 2 ? 'nd' : 'th'))}</div>
					<div className="score-name col-5">{record.name}</div>
					<div className="col-1"></div>
					<div className="score-value col-3">{record.score}</div>
					{lst?'':<div className="col-1 add-btn"><img className="edit-img" src={type=='count'?"plus.png":"edit.png"} alt="" onClick={() => handleClick(record)}/></div>}
				</div>
			)):''}
			<div className="updating-container">{editActive?<Updating game={{name:game.name, type:type, list:lst}} setEditActive={setEditActive} setSyncData={game.setSyncData} record={record}></Updating>:''}
		</div></div>)
}

export default Ranking