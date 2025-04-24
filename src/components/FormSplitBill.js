import { useState } from 'react';
import Button from './Button';
export default function FormSplitBill({ selectedFriend, onSplitBill }) {
	const [bill, setBill] = useState('');
	const [yourShare, setYourShare] = useState('');
	const [whoIsPaying, setWhoIsPaying] = useState('user');

	const payByFriend = bill ? bill - yourShare : '';

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!bill || !yourShare) return;

		const amount = whoIsPaying === 'user' ? payByFriend : -Number(yourShare);
		onSplitBill(amount);

		setBill('');
		setYourShare('');
		setWhoIsPaying('user');
	};

	return (
		<form className='form-split-bill' onSubmit={handleSubmit}>
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
