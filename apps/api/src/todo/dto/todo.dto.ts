import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";

export class TodoDto {
	@ApiProperty({example: `Bake cookies`, required: true})
	@IsNotEmpty()
	@IsString()
	description: string;
}