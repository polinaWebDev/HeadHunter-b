import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";
import {ProfileType} from "../types/profile_type";

@Entity()
export class User {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column({unique:true})
    email: string;

    @ApiProperty()
    @Column()
    password: string;

    @ApiProperty()
    @Column()
    firstName: string;

    @ApiProperty()
    @Column()
    lastName: string;


    @ApiProperty({
        required: false
    })
    @Column({nullable:true})
    avatar_url: string;

    @ApiProperty()
    @Column({ type: "enum", enum: ProfileType })
    profileType: ProfileType;

}