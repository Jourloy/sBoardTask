import {Injectable, Logger} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {User} from "./entities/user.entity";
import {IUser} from "../../types";
import crypto from "crypto";

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>
	) {}

	private readonly logger = new Logger(UserService.name);

	public async get(username: string) {
		const user = await this.userRepository
			.createQueryBuilder(`user`)
			.where(`user.username = :username`, {username: username})
			.getOne();
		if (!user) return null;
		return user;
	}

	public async create(props: IUser) {
		const _user = await this.get(props.username);
		if (_user) return {error: true, code: `USER_EXIST`};

		const user = new User();
		user.username = props.username;
		user.password = crypto.createHash(`sha256`).update(props.password).digest(`hex`);
		user.refreshTokens = [];

		const state = await this.userRepository
			.save(user)
			.catch(e => e)
			.then(() => null);

		if (state) return {error: true, code: `DB_ERROR`, description: state};
		return {error: false, code: `OK`};
	}

	public async login(props: IUser) {
		const user = await this.get(props.username);
		if (!user) return {error: true, code: `USER_NOT_FOUND`};

		const password = crypto.createHash(`sha256`).update(props.password).digest(`hex`);

		if (password !== user.password) return {error: true, code: `PASSWORD_INCORRECT`};
		return {error: false, code: `OK`};
	}

	public async updateTokens(
		refresh: string,
		username: string
	) {
		const user = await this.get(username);
		if (!user) return {error: true, code: `USER_NOT_FOUND`};

		user.refreshTokens.push(refresh);
		if (user.refreshTokens.length > 10) user.refreshTokens.shift();

		const state = await this.userRepository
			.save(user)
			.catch(e => e)
			.then(() => null);

		if (state) return {error: true, code: `DB_ERROR`, description: state};
		return {error: false, code: `OK`};
	}
}