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
	const [selectedFriend, setSelectedFriend] = useState(null);
	const handleShowAddFriend = () => {
		setShowAddFriend(!showAddFriend);
	};
	const handleAddFriend = (friend) => {
		setFriends((friends) => [...friends, friend]);
		setShowAddFriend(false);
	};

	function handleOnSelection(friend) {
		setSelectedFriend(friend);
		setShowAddFriend(false);
	}

	function handleSplitBill(value) {
		setFriends((friends) =>
			friends.map((friend) =>
				friend.id === selectedFriend.id
					? { ...friend, balance: friend.balance + value }
					: friend
			)
		);
	}
	return (
		<div className='app'>
			<div className='sidebar'>
				<FriendList
					friends={friends}
					onSelection={handleOnSelection}
					selectedFriend={selectedFriend}
				/>
				{showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
				<Button
					text={!showAddFriend ? 'Add Friend' : 'Close'}
					onClick={handleShowAddFriend}
				/>
			</div>
			{/* only renders, when you select a friend */}
			{selectedFriend && (
				<FormSplitBill
					selectedFriend={selectedFriend}
					onSplitBill={handleSplitBill}
				/>
			)}
		</div>
	);
}

function FriendList({ friends, onSelection, selectedFriend }) {
	return (
		<ul>
			{friends.map((friend) => (
				<Friend
					friend={friend}
					key={friend.id}
					onSelection={onSelection}
					selectedFriend={selectedFriend}
				/>
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

function Friend({ friend, onSelection, selectedFriend }) {
	const isSelected = selectedFriend?.id === friend.id;
	return (
		<li className={isSelected ? 'selected' : ''}>
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
			<Button text={'Select'} onClick={() => onSelection(friend)} />
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

function FormSplitBill({ selectedFriend, onSplitBill }) {
	const [bill, setBill] = useState('');
	const [yourShare, setYourShare] = useState('');
	const [whoIsPaying, setWhoIsPaying] = useState('user');
	const payByFriend = bill ? bill - yourShare : '';

	const handleOnSubmit = (e) => {
		e.preventDefault();
		if (!bill || !yourShare) return;
		onSplitBill(whoIsPaying === 'user' ? payByFriend : -yourShare);
	};
	return (
		<form className='form-split-bill' onSubmit={handleOnSubmit}>
			<h2>Split a bill with {selectedFriend.name}</h2>
			<label htmlFor=''> Bill</label>
			<input
				type='number'
				placeholder='💸 Amount'
				value={bill}
				onChange={(e) => setBill(Number(e.target.value))}
			/>

			<label htmlFor=''> Your Expense</label>
			<input
				type='number'
				value={yourShare}
				onChange={(e) =>
					setYourShare(
						Number(e.target.value) > bill ? yourShare : Number(e.target.value)
					)
				}
			/>

			<label htmlFor=''> {selectedFriend.name} Expenses</label>
			<input type='text' disabled value={payByFriend} />

			<label htmlFor=''> Who is paying the bill</label>
			<select
				value={whoIsPaying}
				onChange={(e) => setWhoIsPaying(e.target.value)}
			>
				<option value='user'>You</option>
				<option value={selectedFriend.name}>{selectedFriend.name}</option>
			</select>
			<Button text={'Split Bill'} />
		</form>
	);
}
