import Friend from './Friend';
export default function FriendList({
	friends,
	onSelection,
	selectedFriend,
	onDelete,
}) {
	return (
		<ul>
			{friends.map((friend) => (
				<Friend
					friend={friend}
					key={friend.id}
					onSelection={onSelection}
					selectedFriend={selectedFriend}
					onDelete={onDelete} // Pass it down here
				/>
			))}
		</ul>
	);
}
