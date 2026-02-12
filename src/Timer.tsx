import type React from "react";
import { useEffect, useState } from "react";

function Timer (setPage:React.Dispatch<React.SetStateAction<string>>, games:Record<string,string>): React.Dispatch<React.SetStateAction<boolean>> {
	const [isActive, setIsActive] = useState<boolean>(false);

	useEffect(() => {
		let interval: ReturnType<typeof setInterval> | undefined
		let pageID = 1
		if (isActive) {
			interval = setInterval(() => {
				if (pageID==Object.keys(games).length - 1) pageID = 0
				else pageID++
				setPage(Object.keys(games)[pageID])
			}, 5000)
		} else {
			clearInterval(interval)
		}
		return () => clearInterval(interval)
	}, [isActive, setPage, games])

	return setIsActive
}

export default Timer