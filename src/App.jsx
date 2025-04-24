import { useState, useEffect } from 'react';
// import { useLocalStorage } from './useLocalStorage';

import { initialFriends } from './friends';

function Button({ text, onClick }) {
	return (
		<button className='button' onClick={onClick}>
			{text}
		</button>
	);
}

export default function App() {
	const [friends, setFriends] = useState(initialFriends);
	const [showAddFriend, setShowAddFriend] = useState(false);
	// const [selectedFriend, setSeletedFriend] = useState(null);
	const handleShowAddFriend = () => {
		setShowAddFriend(!showAddFriend);
	};
	const handleAddFriend = (friend) => {
		setFriends((friends) => [...friends, friend]);
		setShowAddFriend(false);
	};
	return (
		<div className='app'>
			<div className='sidebar'>
				<FriendList friends={friends} />
				{showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
				<Button
					text={!showAddFriend ? 'Add Friend' : 'Close'}
					onClick={handleShowAddFriend}
				/>
			</div>
			<FormSplitBill />
		</div>
	);
}

function FriendList({ friends }) {
	return (
		<ul>
			{friends.map((friend) => (
				<Friend friend={friend} key={friend.id} />
			))}
		</ul>
	);
}
function Avatar({ name, size = 100, background = 'random' }, color = 'fff') {
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

function Friend({ friend }) {
	return (
		<li>
			{/* <img src='avatar' alt={friend.name} /> */}
			<Avatar name={friend.name} background={friend.background} />
			<h3>{friend.name}</h3>
			{friend.balance < 0 && (
				<p className='red'>
					You owe {friend.name} £{Math.abs(friend.balance)}
				</p>
			)}

			{friend.balance > 0 && (
				<p className='green'>
					{friend.name} owe you £{Math.abs(friend.balance)}
				</p>
			)}

			{friend.balance === 0 && (
				<p className=''>You and {friend.name} are even</p>
			)}
			<Button text={'Select'} />
		</li>
	);
}

function FormAddFriend({ onSubmit, onAddFriend }) {
	const [name, setName] = useState('');

	const [message, setMessage] = useState('');

	const [background, setBackground] = useState('random');

	const handleOnSubmit = (e) => {
		e.preventDefault();

		if (!name) {
			setMessage('Please fill in both the name and image fields.');
			return;
		}

		const id = crypto.randomUUID();
		const newFriend = {
			name,
			background,
			balance: 0,
			id,
		};

		onAddFriend(newFriend);
		setName('');
		setBackground('random');
		setMessage('');

		if (onSubmit) onSubmit(newFriend);
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

function FormSplitBill() {
	return (
		<form className='form-split-bill'>
			<h2>Split a bill with X</h2>
			<label htmlFor=''> Bill</label>
			<input type='text' placeholder='💸 Amount ' />

			<label htmlFor=''> Your Expense</label>
			<input type='text' placeholder=' ' />

			<label htmlFor=''> X Expenses</label>
			<input type='text' disabled />

			<label htmlFor=''> Who is paying the bill</label>
			<select>
				<option value='user'>You</option>
				<option value='friend'>X</option>
			</select>
			<Button text={'Split Bill'} />
		</form>
	);
}
