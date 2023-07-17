import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import {ValidationPipe} from "@nestjs/common";
import "reflect-metadata";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require(`dotenv`).config();

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// Some things

	app.use(cookieParser());

	// Swagger

	const config = new DocumentBuilder()
		.setTitle(`SBoard Task`)
		.setDescription(`Fullstack test task for SBoard`)
		.setExternalDoc(`Github`, `https://github.com/Twyxify/Tracker-Backend`)
		.build();
	const document = SwaggerModule.createDocument(app, config);

	SwaggerModule.setup(`api`, app, document);

	// Defence

	app.enableCors();
	app.use(helmet());
	app.useGlobalPipes(new ValidationPipe());

	await app.listen(10000, `0.0.0.0`);
}

bootstrap().then();
