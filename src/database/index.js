import initSqlJs from 'sql.js';
import SQLite from 'sql.js/dist/sql-wasm.js';

let db = null;

export async function initializeDatabase() {
	const SQL = await initSqlJs({
		locateFile: (file) => `https://sql.js.org/dist/${file}`,
	});

	db = new SQL.Database();

	// Create friends table if it doesn't exist
	db.run(`
    CREATE TABLE IF NOT EXISTS friends (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      background TEXT,
      balance INTEGER DEFAULT 0
    );
  `);

	return db;
}

export function addFriend(friend) {
	db.run(
		'INSERT INTO friends (id, name, background, balance) VALUES (?, ?, ?, ?)',
		[friend.id, friend.name, friend.background, friend.balance]
	);
}

export function updateFriendBalance(id, balance) {
	db.run('UPDATE friends SET balance = ? WHERE id = ?', [balance, id]);
}

export function getAllFriends() {
	const stmt = db.prepare('SELECT * FROM friends');
	const friends = [];
	while (stmt.step()) {
		friends.push(stmt.getAsObject());
	}
	stmt.free();
	return friends;
}

export function saveDatabase() {
	const data = db.export();
	const blob = new Blob([data], { type: 'application/x-sqlite3' });
	localStorage.setItem('friends-db', URL.createObjectURL(blob));
}

export function loadDatabase() {
	const data = localStorage.getItem('friends-db');
	if (data) {
		const binaryString = atob(data);
		const bytes = new Uint8Array(binaryString.length);
		for (let i = 0; i < binaryString.length; i++) {
			bytes[i] = binaryString.charCodeAt(i);
		}
		db = new SQL.Database(bytes);
	}
}
