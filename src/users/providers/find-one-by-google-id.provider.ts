import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FindOneByGoogleIdProvider {
    constructor(
        /**
         * Inject user repository
         */
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>
    ){}
    public async findOnByGoogleId(googleId: string){
        return await this.usersRepository.findOneBy({googleId})
    }
}
