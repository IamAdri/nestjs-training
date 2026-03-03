import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CreateUserProvider {
  constructor(
    /**
     * Inject users repository
     */
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    /**
     * Inject hashingProvider
     */
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
  ) {}
  public async createUser(createUserDto: CreateUserDto) {
    let existingUser: User | null;
    try {
      //Check if user already exists with same email
      existingUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });
    } catch (error) {
      //Might save the details of the exception
      //Information which is sensitive
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please trye later!',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    //Handle exception
    if (existingUser) {
      throw new BadRequestException(
        'The user already exists, please check your email!',
      );
    }
    //Create a new user
    let newUser = this.usersRepository.create({
      ...createUserDto,
      password: await this.hashingProvider.hashPassword(createUserDto.password),
    });
    //Handle exception
    try {
      newUser = await this.usersRepository.save(newUser);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please trye later!',
        { description: 'Error connecting to the database!' },
      );
    }
    //  if (!newUser) {
    //   throw new BadRequestException(
    //      'The user could not be created, please ty again!',
    //    );
    // }
    newUser = await this.usersRepository.save(newUser);
    return newUser;
  }
}
