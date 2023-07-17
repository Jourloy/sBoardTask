import {DataSource} from "typeorm";
// eslint-disable-next-line @typescript-eslint/no-var-requires
require(`dotenv`).config();

export default new DataSource({
	type: `postgres`,
	host: process.env.PG_HOST,
	port: +process.env.PG_PORT,
	username: process.env.PG_USERNAME,
	password: process.env.PG_PASSWORD,
	database: process.env.PG_DATABASE,
	entities: [__dirname + `/**/*.entity{.ts,.js}`],
	migrations: [__dirname + `/migrations/**/*{.ts,.js}`],
});
