import {Entity, Column, PrimaryGeneratedColumn, ManyToOne} from "typeorm";
import {User} from "../../user/entities/user.entity";

@Entity()
export class Todo {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	description: string;

	@ManyToOne(() => User, user => user.todo)
	author: User;
}