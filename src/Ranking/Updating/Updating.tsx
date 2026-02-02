import type React from "react";
import { useState } from "react";
import './Updating.scss'

interface responseType {
  status: number;
  message: string;
  data?: Record<string,Record<string,string>>
}

const base = "https://script.google.com/macros/s/AKfycby9YuT6M7edvR95BGG3RS4G6ETLy6pqVMoSx4zvJ7Ysw9Q5gHV6xJwX7M_5OX_DNoL8/exec"

const Updating: React.FC<{ game: {name:string,type:string,list:boolean}, setEditActive: React.Dispatch<React.SetStateAction<boolean>>, setSyncData: React.Dispatch<React.SetStateAction<boolean>>, record:{name:string,rank:number,score:string}}> = ({ game, setEditActive, setSyncData, record}) => {
	const [formData, setFormData] = useState({ name: record.name, score: game.type=='count' && record.score!='' ? parseInt(record.score)+1 : record.score })
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	}

	const handleSubmit = async () => {
		if (formData.name == '') return;
		if (game.type == 'time' && formData.score.toString() !='' && !/^\d*:\d*[:\d*]*$/.test(formData.score.toString())) {console.log('quit on time'); return};
		if (game.type == 'count' && formData.score.toString() != '' && !parseInt(record.score)) {console.log('quit on score');return}

		const setData = async () => {
			try {
				// console.log(`${base}?req=addEntry&name=${formData.name}&score=${formData.score}&game=${game.name}`)
				let response
				if (game.list) {
					response = await fetch(`${base}?req=addEntry&name=${formData.name}&value=${formData.score}&game=${game.name}`)
				} else {
					response = await fetch(`${base}?req=set&name=${formData.name}&value=${formData.score}&game=${game.name}`)
				}
				if (!response.ok) {throw new Error('Network response was not ok')}
				const respData: responseType = await response.json()
				console.log(respData)
				if (respData.status !== 200) {throw new Error(respData.message)}
			} catch (e) {
				console.log(e)
			}
			setSyncData(prev => !prev)
		};
		setData();
		setEditActive(false)
	}

	const handleQuit = () => {
		setEditActive(false)
	}

	return (
		<div className="form">
			<input name="name" onChange={handleChange} placeholder="Naam" value={formData.name}/>
			<input name="score" onChange={handleChange} placeholder="Score" value={formData.score}/>
			<button onClick={handleSubmit} className="edit-btn">Bewerken</button>
			<button onClick={handleQuit} className="quit-btn">Annuleer</button>
		</div>
	)
}

export default Updating