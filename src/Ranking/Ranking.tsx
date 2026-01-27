import type React from "react";
import { useEffect, useState } from "react";

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
	if (data) return <ul>
		{Object.entries(data).map(([name, value]) => (
			<li>{name}: {value}</li>
		))}
	</ul>
}

export default Ranking