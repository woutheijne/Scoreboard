import type React from "react";
import { useState } from "react";
import './Updating.scss'

interface responseType {
  status: number;
  message: string;
  data?: Record<string,Record<string,string>>
}

const Updating: React.FC<{ game: string, setEditActive: React.Dispatch<React.SetStateAction<boolean>>, setSyncData: React.Dispatch<React.SetStateAction<boolean>>}> = ({ game, setEditActive, setSyncData}) => {
	const [formData, setFormData] = useState({ name: '', score: '' })
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	}

	const handleSubmit = async () => {
		if (formData.name == '' || formData.score=='') return;

		const setData = async () => {
			try {
				const response = await fetch(`https://script.google.com/macros/s/AKfycbyGGt_GnoLCxPby5KJUwOBqi9YPe8ZJGHh4Khv1qSRJ9hK7-Q_kwW77odl9hEq48DKN/exec?name=${formData.name}&score=${formData.score}&game=${game}`, {method: 'GET', mode:'no-cors'})
				if (!response.ok) {throw new Error('Network response was not ok')}
				const respData: responseType = await response.json()
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
			<input name="name" placeholder="Naam" onChange={handleChange} />
			<input name="score" placeholder="Score" onChange={handleChange} />
			<button onClick={handleSubmit} className="edit-btn">Bewerken</button>
			<button onClick={handleQuit} className="quit-btn">Annuleer</button>
		</div>
	)
}

export default Updating