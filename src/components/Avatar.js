import { useState, useEffect } from 'react';

export default function Avatar(
	{ name, size = 100, background = 'random' },
	color = 'fff'
) {
	const [avatarUrl, setAvatarUrl] = useState('');

	useEffect(() => {
		let objectUrl = '';

		async function fetchAvatar() {
			const url = `https://ui-avatars.com/api/?name=${encodeURIComponent(
				name
			)}&size=${size}&background=${background}&color=${color}`;

			try {
				const response = await fetch(url);
				const blob = await response.blob();
				objectUrl = URL.createObjectURL(blob);
				setAvatarUrl(objectUrl);
			} catch (error) {
				console.error('Failed to load avatar', error);
				setAvatarUrl('');
			}
		}

		fetchAvatar();
	}, [name, size, background, color]);

	return (
		<img
			src={
				avatarUrl ||
				`https://ui-avatars.com/api/?name=${encodeURIComponent(
					name
				)}&size=${size}`
			}
			alt={name}
		/>
	);
}
