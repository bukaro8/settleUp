import Friend from './Friend';
export default function FriendList({
	friends,
	onSelection,
	selectedFriend,
	onDelete,
	sortBy,
	onSort,
}) {
	return (
		<div className='friends-container'>
			<div className='sort-controls'>
				<span>Sort by:</span>
				<select value={sortBy} onChange={(e) => onSort(e.target.value)}>
					<option value='name'>Name (A-Z)</option>
					<option value='balance-asc'>Balance (Lowest first)</option>
					<option value='balance-desc'>Balance (Highest first)</option>
				</select>
			</div>
			<ul>
				{friends.map((friend) => (
					<Friend
						key={friend.id}
						friend={friend}
						onSelection={onSelection}
						selectedFriend={selectedFriend}
						onDelete={onDelete}
					/>
				))}
			</ul>
		</div>
	);
}
