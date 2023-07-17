import {createParamDecorator, ExecutionContext} from "@nestjs/common";

export const CurrentUser = createParamDecorator(
	(data: unknown, context: ExecutionContext) => {
		const locals = context.switchToHttp().getResponse().locals;
		const username = locals.username;
		return {username: username, access: locals.access};
	}
);

export interface ICurrentUser {
	username: string;
	access: string
}