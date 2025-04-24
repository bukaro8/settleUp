import Avatar from './Avatar';
import Button from './Button';

export default function Friend({
	friend,
	onSelection,
	selectedFriend,
	onDelete,
}) {
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
					{friend.name} owes you £{Math.abs(friend.balance)}
				</p>
			)}
			{friend.balance === 0 && <p>You and {friend.name} are even</p>}
			<div className='friend-actions'>
				<Button text='Select' onClick={() => onSelection(friend)} />

				<button
					className='delete-btn'
					onClick={(e) => {
						e.stopPropagation();
						onDelete(friend.id);
					}}
				>
					Delete
				</button>
			</div>
		</li>
	);
}
