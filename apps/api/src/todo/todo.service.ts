import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {UserService} from "../user/user.service";
import { Todo } from "./entities/todo.entity";

@Injectable()
export class TodoService {
	constructor(
		@InjectRepository(Todo)
		private repository: Repository<Todo>,
		private userService: UserService
	) {}

	/**
	 * Return one todo by ID
	 * @param id
	 * @param email
	 * @private
	 */
	private async getOne(id: number, username: string) {
		const todo = await this.repository
			.createQueryBuilder(`todo`)
			.leftJoinAndSelect(`todo.author`, `user`)
			.where(`todo.id = :id`, {id: id})
			.andWhere(`user.username = :username`, {username: username})
			.getOne();

		delete todo.author.password;
		delete todo.author.refreshTokens;

		return todo;
	}

	/**
	 * Return 5 todos
	 * @param page
	 */
	public async get(page: number) {
		const todo = await this.repository
			.createQueryBuilder(`todo`)
			.leftJoinAndSelect(`todo.author`, `user`)
			.skip(page * 5 - 5)
			.take(5)
			.getMany();
		
		todo.forEach(todo => {
			delete todo.author.password;
			delete todo.author.refreshTokens;
		});

		return {error: false, code: `OK`, data: todo};
	}

	public async getPages() {
		const todo = await this.repository
			.createQueryBuilder(`todo`)
			.getCount();

		return {error: false, code: `OK`, data: Math.ceil(todo / 5)};
	}

	/**
	 * Return 5 todos
	 * @param page
	 */
	public async getOwned(page: number, username: string) {
		const todo = await this.repository
			.createQueryBuilder(`todo`)
			.leftJoinAndSelect(`todo.author`, `user`)
			.where(`user.username = :username`, {username: username})
			.skip(page * 5 - 5)
			.take(5)
			.getMany();

		todo.forEach(todo => {
			delete todo.author.password;
			delete todo.author.refreshTokens;
		});

		return {error: false, code: `OK`, data: todo};
	}

	public async getOwnedPages(username: string) {
		const todo = await this.repository
			.createQueryBuilder(`todo`)
			.leftJoinAndSelect(`todo.author`, `user`)
			.where(`user.username = :username`, {username: username})
			.getCount();

		return {error: false, code: `OK`, data: Math.ceil(todo / 5)};
	}

	/**
	 * Create todo entity
	 * @param props
	 * @param email
	 */
	public async create(props: ITodo, username: string) {
		const author = await this.userService.get(username);
		if (!author) return {error: true, code: `USER_NOT_FOUND`};

		const todo = this.repository.create({...props, author: author});
		const state = await this.repository
			.save(todo)
			.catch(e => e)
			.then(() => null);

		if (state) return {error: true, code: `DB_ERROR`, description: state};
		return {error: false, code: `OK`};
	}

	/**
	 * Update news entity
	 * @param id
	 * @param update
	 * @param email
	 */
	public async update(id: number, update: ITodo, username) {
		let todo = await this.getOne(id, username);
		if (!todo) return {error: true, code: `NEWS_NOT_FOUND`};

		todo = Object.assign(todo, update);

		const state = await this.repository
			.save(todo)
			.catch(e => e)
			.then(() => null);

		if (state) return {error: true, code: `DB_ERROR`, description: state};
		return {error: false, code: `OK`};
	}

	/**
	 * Remove news from database
	 * @param id
	 * @param email
	 */
	public async remove(id: number, username: string) {
		const todo = await this.getOne(id, username);
		if (!todo) return {error: true, code: `NEWS_NOT_FOUND`};

		const state = await this.repository
			.remove(todo)
			.catch(e => e)
			.then(() => null);

		if (state) return {error: true, code: `DB_ERROR`, description: state};
		return {error: false, code: `OK`};
	}
}

interface ITodo {
	description: string;
}