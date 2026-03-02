import { Pool } from "pg";
import 'dotenv/config';

const pool = new Pool({
   user: process.env.DB_USER ,
  host: process.env.DB_HOST ,
  database: process.env.DB_NAME ,
  password: process.env.DB_PASSWORD ,
  port: process.env.DB_PORT ,
});



// Test de connexion au démarrage
const testConnection = async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('✅ PostgreSQL connected. Current time:', res.rows[0].now);
  } catch (err) {
    console.error('❌ PostgreSQL connection error:', err);
    process.exit(1); // Arrête le serveur si DB inaccessible
  }
};

testConnection();


export default pool;