import { DataSource } from "typeorm";

export default new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5433,
    username: 'postgres',
    password: 'IKnowNestjs26!',
    database: 'nestjs-blog',
    entities: ['**/*.entity.js'],
    migrations: ['migrations/*.js']
})