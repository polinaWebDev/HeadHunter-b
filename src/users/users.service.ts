import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./user.entity";
import {Repository} from "typeorm";
import {ProfileType} from "../types/profile_type";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async createUser(email: string, password: string, firstName:string, lastName:string, profileType: ProfileType,  avatar_url?:string ) {
        const user = this.userRepository.create({email, password, firstName, lastName, profileType, avatar_url});
        return this.userRepository.save(user);
    }

    async findById(id: number) {
        return this.userRepository.findOne({ where: { id } });
    }

    async findByEmail(email: string) {
        return this.userRepository.findOne({ where: { email } });
    }
}