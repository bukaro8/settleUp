import { useState, useEffect } from 'react';
import { db } from './db';
import Button from './components/Button';
import FormAddFriend from './components/FormAddFriend';
import FriendList from './components/FriendList';
import FormSplitBill from './components/FormSplitBill';
// import { initialFriends } from './friends';

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
