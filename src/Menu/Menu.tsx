import type React from "react";
import './menu.scss'

interface props {
	games: string[];
	setPage: React.Dispatch<React.SetStateAction<string>>
	setIsActive: React.Dispatch<React.SetStateAction<boolean>>
}

const Menu: React.FC<props> = (props) => {
	
	return (
		<div className="menu-block">
			
			<ul id="menu" className="">
				<li onClick={() => {props.setIsActive(true);props.setPage(props.games[0])}}>Loop</li>
				{(props.games.length !== 0) ?
				props.games.map((game) => (
					<div key={game}>
						<div className="rule"></div>
						<li onClick={() => props.setPage(game)}>{game}</li>
					</div>
				)): <div><div className="rule"></div><li style={{cursor:'default'}}>Laden...</li></div>}
				{/* <div className="rule"></div> */}
			</ul>
		</div>
	)
}

export default Menu