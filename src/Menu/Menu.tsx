import type React from "react";
import './menu.scss'

interface props {
	games: Record<string,string>;
	loading: boolean
	setPage: React.Dispatch<React.SetStateAction<string>>
	setIsActive: React.Dispatch<React.SetStateAction<boolean>>
	setSyncData: React.Dispatch<React.SetStateAction<boolean>>
	setSyncActive: React.Dispatch<React.SetStateAction<boolean>>
}

const Menu: React.FC<props> = (props) => {
	const games = Object.keys(props.games)
	
	return (
		<div className="menu-block">
			
			<ul id="menu" className="">
				{(games.length !== 0 && !props.loading) ?
				<>
				<li onClick={() => {props.setIsActive(true);props.setPage(games[0])}}>loopen</li>
				{games.map((game) => (
					<div key={game}>
						<div className="rule"></div>
						<li onClick={() => props.setPage(game)}>{game}</li>
					</div>
				))}
				</>: <div><div className="rule"></div><li style={{cursor:'default'}}>Laden...</li></div>}
				<div className="rule"></div>
				<li onClick={() =>{ props.setSyncData(prev => !prev);props.setSyncActive(true)}}>Verversen</li>
			</ul>
		</div>
	)
}

export default Menu