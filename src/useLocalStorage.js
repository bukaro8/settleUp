//!unused code. is an option to use instead than the Dexie DB and
//! save the information in local storage
//! it will be gone when you restart the computer
import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
	const [value, setValue] = useState(() => {
		const storedValue = localStorage.getItem(key);
		return storedValue ? JSON.parse(storedValue) : initialValue;
	});

	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(value));
	}, [key, value]);

	return [value, setValue];
}
