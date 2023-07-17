import {
	Body,
	Controller,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Query,
	Res,
	UseGuards,
} from "@nestjs/common";
import {ApiOperation, ApiParam, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Response} from "express";
import {CurrentUser, ICurrentUser} from "../decorators/user.decorator";
import {JwtGuard} from "../guards/jwt.guard";

import {TodoService} from "./todo.service";
import {TodoDto} from "./dto/todo.dto";

@Controller(`todo`)
@ApiTags(`Todo`)
export class TodoController {
	constructor(private readonly todoService: TodoService) {}

	@Post(`/create`)
	@UseGuards(JwtGuard)
	@ApiOperation({summary: `Create Todo`})
	@ApiResponse({
		status: 200,
		description: `Todo successfully created`,
	})
	@ApiResponse({status: 400, description: `Error, look into body for get more info`})
	async createTodo(
		@Body() body: TodoDto,
		@CurrentUser() user: ICurrentUser,
		@Res() response: Response
	) {
		const state = await this.todoService.create(body, user.username);
		const status = state.error ? 400 : 200;
		response.status(status).json(state);
	}

	@Post(`/update/:id`)
	@UseGuards(JwtGuard)
	@ApiOperation({summary: `Update Todo`})
	@ApiResponse({
		status: 200,
		description: `Todo successfully updated`,
	})
	@ApiResponse({status: 400, description: `Error, look into body for get more info`})
	async updateTodo(
		@Param(`id`, ParseIntPipe) id: number,
		@Body() body: TodoDto,
		@CurrentUser() user: ICurrentUser,
		@Res() response: Response
	) {
		const state = await this.todoService.update(id, body, user.username);
		const status = state.error ? 400 : 200;
		response.status(status).json(state);
	}

	@Post(`/remove/:id`)
	@UseGuards(JwtGuard)
	@ApiOperation({summary: `Remove Todo`})
	@ApiResponse({
		status: 200,
		description: `Todo successfully removed`,
	})
	@ApiResponse({status: 400, description: `Error, look into body for get more info`})
	async removeTodo(
		@Param(`id`, ParseIntPipe) id: number,
		@CurrentUser() user: ICurrentUser,
		@Res() response: Response
	) {
		const state = await this.todoService.remove(id, user.username);
		const status = state.error ? 400 : 200;
		response.status(status).json(state);
	}

	@Get(`/`)
	@ApiOperation({summary: `Get 5 Todo`})
	@ApiParam({name: `page`, required: true, example: 2})
	@ApiResponse({
		status: 200,
		description: `Here you never get not 200 status, maybe only empty array`,
	})
	async getTodo(@Query() query: {page: string}, @Res() response: Response) {
		const state = await this.todoService.get(+query.page);
		response.status(200).json(state);
	}

	@Get(`/owned`)
	@ApiOperation({summary: `Get 5 Todo`})
	@ApiParam({name: `page`, required: true, example: 2})
	@ApiResponse({
		status: 200,
		description: `Here you never get not 200 status`,
	})
	async getOwnedTodo(
		@Query() query: {page: string},
		@CurrentUser() user: ICurrentUser,
		@Res() response: Response
	) {
		const state = await this.todoService.getOwned(+query.page, user.username);
		response.status(200).json(state);
	}

	@Get(`/pages`)
	@ApiOperation({summary: `Get total Todo pages`})
	@ApiResponse({
		status: 200,
		description: `Here you never get not 200 status, maybe only empty array`,
	})
	async getTodoPages(@Res() response: Response) {
		const state = await this.todoService.getPages();
		response.status(200).json(state);
	}

	@Get(`/owned/pages`)
	@ApiOperation({summary: `Get total owned Todo pages`})
	@ApiResponse({
		status: 200,
		description: `Here you never get not 200 status`,
	})
	async getOwnedTodoPages(
		@CurrentUser() user: ICurrentUser,
		@Res() response: Response
	) {
		const state = await this.todoService.getOwnedPages(user.username);
		response.status(200).json(state);
	}
}
