import { useEffect, useState } from "react";

function SyncTimer (setSync:React.Dispatch<React.SetStateAction<boolean>>) {
	const [syncActive, setSyncActive] = useState<boolean>(false)
	useEffect(() => {
		let interval: ReturnType<typeof setInterval> | undefined
		if (syncActive) {
			interval = setInterval(() => {
				console.log('Starting timed sync')
				setSync(prev => !prev)
			}, 300_000)
		} 
		return () => clearInterval(interval)
	}, [syncActive, setSync])
	return setSyncActive
}

export default SyncTimer