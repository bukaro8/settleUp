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
