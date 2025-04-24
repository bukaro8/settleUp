import { useState } from 'react';
import Button from './Button';
export default function FormAddFriend({ onSubmit, onAddFriend }) {
	const [name, setName] = useState('');
	const [message, setMessage] = useState('');
	const [background, setBackground] = useState('random');

	const handleOnSubmit = (e) => {
		e.preventDefault();

		if (!name) {
			setMessage('Please fill in the name field.');
			return;
		}

		const newFriend = {
			name,
			background,
			balance: 0,
			//!Change id to be handle by Dexie
		};

		onAddFriend(newFriend);
		setName('');
		setBackground('random');
		setMessage('');
	};

	return (
		<form className='form-add-friend' onSubmit={handleOnSubmit}>
			<label htmlFor=''>🧌 Friend</label>
			<input
				type='text'
				placeholder='Friend Name'
				value={name}
				onChange={(e) => setName(e.target.value)}
			/>

			{message && <p style={{ color: 'red' }}>{message}</p>}
			<div>
				<h3>Background:</h3>
				<input
					type='button'
					className='avatar'
					style={{ backgroundColor: 'black' }}
					onClick={(e) => setBackground('000')}
				/>
				<input
					type='button'
					className='avatar'
					style={{ backgroundColor: '#00f' }}
					onClick={(e) => setBackground('00f')}
				/>

				<input
					type='button'
					className='avatar'
					style={{ backgroundColor: '#f00' }}
					onClick={(e) => setBackground('f00')}
				/>
			</div>
			<Button text={'Add'} />
		</form>
	);
}
