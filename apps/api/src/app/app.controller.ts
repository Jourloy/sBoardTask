import {Controller, Get, Res} from "@nestjs/common";
import {AppService} from "./app.service";
import {Response} from "express";

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get(`/`)
	getStatus(@Res() response: Response) {
		response.status(200).send(`OK`);
	}
}
