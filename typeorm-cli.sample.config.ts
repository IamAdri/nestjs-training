import { DataSource } from "typeorm";

export default new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: "USERNAME",
    password: 'PASSWORD',
    database: 'DATABASE',
    entities: ['**/*.entity.js'],
    migrations: ['migrations/*.js']
})