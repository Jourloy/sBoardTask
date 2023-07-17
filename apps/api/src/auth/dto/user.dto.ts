import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";

export class UserDto {
	@ApiProperty({example: `jourloy`, required: true})
	@IsNotEmpty()
	@IsString()
	username: string;

	@ApiProperty({example: `qwerty321`, required: true})
	@IsNotEmpty()
	@IsString()
	password: string;
}