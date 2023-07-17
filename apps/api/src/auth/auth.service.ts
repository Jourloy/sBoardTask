import {Injectable} from "@nestjs/common";
import {sign, verify} from "jsonwebtoken";
import {UserService} from "../user/user.service";
import {IUser} from "../../types";

@Injectable()
export class AuthService {
	constructor(private readonly userService: UserService) {}

	/**
	 * Generate access and refresh JWT tokens
	 * @param username
	 * @private
	 */
	private generateTokens(username: string): {access: string; refresh: string} {
		const refresh = sign({username}, process.env.SECRET, {expiresIn: `7d`});
		const access = sign({username}, process.env.SECRET, {expiresIn: `1d`});
		return {refresh, access};
	}

	/**
	 * Update JWT tokens
	 * @param refresh
	 */
	public async updateTokens(refresh: string) {
		try {
			// Try to decode token
			const decoded = verify(refresh, process.env.SECRET);
			const user = await this.userService.get((decoded as {username: string}).username);

			// Check tokens
			if (!user.refreshTokens.includes(refresh)) {
				return {error: true, code: `REFRESH_TOKEN_NOT_VALID`};
			}

			// Generate new tokens
			const {refresh: newRefresh, access: newAccess} = this.generateTokens(
				user.username
			);

			// Update user's token
			const updateState = await this.userService.updateTokens(
				newRefresh,
				user.username
			);
			if (updateState.error) return updateState;

			return {error: false, code: `OK`, refresh: newRefresh, access: newAccess};
		} catch (err) {
			return {error: true, code: `JWT_VERIFY_ERR`, description: err.message};
		}
	}

	/**
	 * Register user in system
	 * @param props
	 */
	public async register(props: IUser) {
		const createState = await this.userService.create(props);

		// If error while create return state
		if (createState.error) return createState;

		// Generate new tokens
		const {refresh: newRefresh, access: newAccess} = this.generateTokens(props.username);

		const user = await this.userService.get(props.username);

		// Update user's token
		const updateState = await this.userService.updateTokens(newRefresh, user.username);
		if (updateState.error) return updateState;

		// If error while update return state
		if (updateState.error) return updateState;

		return {error: false, code: `OK`, refresh: newRefresh, access: newAccess};
	}

	/**
	 * Login user in system
	 * @param props
	 */
	public async login(props: IUser) {
		const loginState = await this.userService.login(props);

		// If error while login return state
		if (loginState.error) {
			const createState = await this.userService.create(props);

			// If error while create return state
			if (createState.error) return createState;
		}

		// Check refresh tokens
		const user = await this.userService.get(props.username);

		// Generate new tokens
		const {refresh: newRefresh, access: newAccess} = this.generateTokens(
			props.username
		);

		// Update user's token
		const updateState = await this.userService.updateTokens(
			newRefresh,
			user.username
		);
		if (updateState.error) return updateState;

		// If error while update return state
		if (updateState.error) return updateState;

		return {error: false, code: `OK`, refresh: newRefresh, access: newAccess};
	}
}
