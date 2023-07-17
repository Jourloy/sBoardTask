/* eslint-disable no-unreachable */
import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import {Observable} from "rxjs";
import * as jwt from "jsonwebtoken";

@Injectable()
export class JwtGuard implements CanActivate {
	canActivate(
		context: ExecutionContext
	): boolean | Promise<boolean> | Observable<boolean> {
		const locals = context.switchToHttp().getResponse().locals;
		const access = locals.access;

		if (!access) throw new UnauthorizedException(`Not found JWT`);
		else {
			const decode = jwt.decode(access);
			if (!decode) throw new UnauthorizedException(`Can't decode`);

			try {
				const verify = jwt.verify(access, process.env.SECRET);
				if (decode[`username`] === verify[`username`]) return true;
			} catch (e) {
				throw new UnauthorizedException(`Can't verify`);
			}
		}

		throw new UnauthorizedException(`JWT isn't valid`);
	}
}
