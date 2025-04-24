import { useState, useEffect } from 'react';
import { db } from './db';
import Button from './components/Button';
import FormAddFriend from './components/FormAddFriend';
import FriendList from './components/FriendList';
import FormSplitBill from './components/FormSplitBill';
import Footer from './components/Footer';
import Header from './components/Header';
import HowItWorks from './components/HowItWorks';

// import { initialFriends } from './friends';

export default function App() {
	const [friends, setFriends] = useState([]);
	const [showAddFriend, setShowAddFriend] = useState(false);
	const [selectedFriend, setSelectedFriend] = useState(null);
	const [sortBy, setSortBy] = useState('name');
	//?load friends when starts
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
	const sortFriends = (friends) => {
		const sorted = [...friends];
		switch (sortBy) {
			case 'name':
				return sorted.sort((a, b) => a.name.localeCompare(b.name));
			case 'balance-asc':
				return sorted.sort((a, b) => a.balance - b.balance);
			case 'balance-desc':
				return sorted.sort((a, b) => b.balance - a.balance);
			default:
				return sorted;
		}
	};

	const handleSplitBill = async (value) => {
		if (!selectedFriend) return;

		try {
			const newBalance = selectedFriend.balance + value;

			await db.friends.update(selectedFriend.id, { balance: newBalance });

			setFriends((friends) =>
				friends.map((friend) =>
					friend.id === selectedFriend.id
						? { ...friend, balance: newBalance }
						: friend
				)
			);

			setSelectedFriend((prev) => ({ ...prev, balance: newBalance }));
		} catch (error) {
			console.error('Error updating balance:', error);
		}
	};

	const handleDeleteFriend = async (id) => {
		await db.friends.delete(id);

		setFriends((prev) => prev.filter((friend) => friend.id !== id));

		if (selectedFriend && selectedFriend.id === id) {
			setSelectedFriend(null);
		}
	};

	return (
		<div className='app-container'>
			<Header />
			<HowItWorks />
			<div className='app'>
				<div className='sidebar'>
					<FriendList
						friends={sortFriends(friends)}
						onSelection={handleOnSelection}
						selectedFriend={selectedFriend}
						onDelete={handleDeleteFriend}
						sortBy={sortBy}
						onSort={setSortBy}
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
			<Footer />
		</div>
	);
}
