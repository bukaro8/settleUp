import Dexie from 'dexie';

export const db = new Dexie('friendsDatabase');

//? Define the database schema
db.version(1).stores({
	friends: '++id, name, balance, background', // Primary key and indexed fields
});

//? Open the database
db.open().catch((err) => {
	console.error('Failed to open db: ' + (err.stack || err));
});
