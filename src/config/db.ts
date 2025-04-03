export const DB_CONFIG: any = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(String(process.env.DB_PORT)),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};