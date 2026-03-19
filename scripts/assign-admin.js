import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '../data/local.db');
const db = new Database(dbPath);

// Get user ID
const user = db.prepare('SELECT id FROM user WHERE email = ?').get('DavidYangPersonal@outlook.com');
if (!user) {
  console.log('User not found');
  process.exit(1);
}

// Get super_admin role ID
const role = db.prepare('SELECT id FROM role WHERE name = ?').get('super_admin');
if (!role) {
  console.log('Role not found');
  process.exit(1);
}

// Check if already assigned
const existing = db.prepare('SELECT * FROM user_role WHERE userId = ? AND roleId = ?').get(user.id, role.id);
if (existing) {
  console.log('User already has super_admin role');
} else {
  // Assign role
  db.prepare('INSERT INTO user_role (userId, roleId) VALUES (?, ?)').run(user.id, role.id);
  console.log('✅ Assigned super_admin role to DavidYangPersonal@outlook.com');
}

db.close();
