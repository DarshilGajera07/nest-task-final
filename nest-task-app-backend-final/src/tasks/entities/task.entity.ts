import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity.js";

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    title : string

    @Column()
    description! : string

    @Column({default : false})
    completed : boolean

    @ManyToOne(() => User, (user) => user.tasks)
    user : User


}
