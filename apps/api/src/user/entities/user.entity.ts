import {Todo} from "../../todo/entities/todo.entity";
import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from "typeorm";

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	username: string;

	@Column()
	password: string;

	@Column(`text`, {array: true})
	refreshTokens: string[];

	@OneToMany(() => Todo, todo => todo.author)
	todo?: Todo[];
}
