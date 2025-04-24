import { useState, useEffect } from 'react';
import { db } from './db';
import Button from './components/Button';
import Friend from './components/Friend';
import { initialFriends } from './friends';

export default function App() {
	const [friends, setFriends] = useState([]);
	const [showAddFriend, setShowAddFriend] = useState(false);
	const [selectedFriend, setSelectedFriend] = useState(null);

	useEffect(() => {
		const loadFriends = async () => {
			const friendsFromDb = await db.friends.toArray();
			setFriends(friendsFromDb);
		};

		loadFriends();
	}, []);

	const handleShowAddFriend = () => {
		setShowAddFriend(!showAddFriend);
	};

	const handleAddFriend = async (friend) => {
		const id = await db.friends.add(friend);

		setFriends((prev) => [...prev, { ...friend, id }]);
		setShowAddFriend(false);
	};

	function handleOnSelection(friend) {
		setSelectedFriend(friend);
		setShowAddFriend(false);
	}

	async function handleSplitBill(value) {
		if (!selectedFriend) return;

		await db.friends.update(selectedFriend.id, {
			balance: selectedFriend.balance + value,
		});

		setFriends((friends) =>
			friends.map((friend) =>
				friend.id === selectedFriend.id
					? { ...friend, balance: friend.balance + value }
					: friend
			)
		);
	}

	// Add delete handler
	const handleDeleteFriend = async (id) => {
		//* Delete from IndexedDB first
		await db.friends.delete(id);
		//? Then update state
		setFriends((prev) => prev.filter((friend) => friend.id !== id));
		//! Deselect if the deleted friend was selected
		if (selectedFriend && selectedFriend.id === id) {
			setSelectedFriend(null);
		}
	};

	return (
		<div className='app'>
			<div className='sidebar'>
				<FriendList
					friends={friends}
					onSelection={handleOnSelection}
					selectedFriend={selectedFriend}
					onDelete={handleDeleteFriend}
				/>
				{showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
				<Button
					text={!showAddFriend ? 'Add Friend' : 'Close'}
					onClick={handleShowAddFriend}
				/>
			</div>
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
