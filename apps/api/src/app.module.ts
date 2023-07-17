import {MiddlewareConsumer, Module, NestModule} from "@nestjs/common";
import {AppController} from "./app/app.controller";
import {AppService} from "./app/app.service";
import {AuthModule} from "./auth/auth.module";
import {UserModule} from "./user/user.module";
import {TodoModule} from "./todo/todo.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthMiddleware } from "./middlewares/auth.middleware";

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				type: `postgres`,
				host: configService.get(`PG_HOST`),
				port: +configService.get(`PG_PORT`),
				username: configService.get(`PG_USERNAME`),
				password: configService.get(`PG_PASSWORD`),
				database: configService.get(`PG_DATABASE`),
				entities: [__dirname + `/../**/*.entity{.ts,.js}`],
				synchronize: false,
				migrationsRun: Boolean(configService.get(`PG_MIGRATIONSRUN`)),
				logging: Boolean(configService.get(`PG_LOGGING`)),
				logger: configService.get(`PG_LOGGER`),
				migrations: [__dirname + `/database/migrations/**/*{.ts,.js}`],
				cli: {
					migrationsDir: `src/database/migrations`,
				},
			}),
			inject: [ConfigService],
		}),
		AuthModule,
		UserModule,
		TodoModule,
	],
	controllers: [AppController],
	providers: [AppService],
})

export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(AuthMiddleware).forRoutes(`*`);
	}
}
