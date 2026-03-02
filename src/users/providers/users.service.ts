import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { AuthService } from 'src/auth/providers/auth.service';
import { DataSource, Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import type { ConfigType } from '@nestjs/config';
import profileConfig from '../config/profile.config';
import { error } from 'console';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';


/**
 * Class to connect to Users table and perform business operations
 */

@Injectable()
export class UsersService {
  constructor(
    /**
     * Injecting usersRepository
     */
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    //Inject Auth Service
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @Inject(profileConfig.KEY)
    private readonly profileConfiguration: ConfigType<typeof profileConfig>,

    /**
     * Inject usersCreateManyProvider
     */
    private readonly usersCreateManyProvider: UsersCreateManyProvider,
  ) {}
  /**
   *The method to get all users from the database
   */
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
    let newUser = this.usersRepository.create(createUserDto);
    //Handle exception
    try{
      newUser = await this.usersRepository.save(newUser);
    } catch(error){
      throw new RequestTimeoutException('Unable to process your request at the moment, please trye later!',
        {description: 'Error connecting to the database!'}
      )
    }
  //  if (!newUser) {
   //   throw new BadRequestException(
  //      'The user could not be created, please ty again!',
  //    );
   // }
    newUser = await this.usersRepository.save(newUser);
    return newUser;
  }

  public findAll(
    getUsersParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    /*
    throw new HttpException({
      status: HttpStatus.MOVED_PERMANENTLY,
      error: 'The Api endpoint does not exist',
      fileName: 'users.service.ts',
      lineNUmbre: 48
    },HttpStatus.MOVED_PERMANENTLY,{cause:new Error(), description: 'Occured because the api endpoint was permanently moved'})*/
  }
  /**
   * Find a single user based on id
   */
  //Find user by id
  public async findOneById(id: number) {
    let user: User | null;
    try {
      user = await this.usersRepository.findOneBy({
        id,
      });
    } catch (error) {
      throw new RequestTimeoutException('Unable to process your request at the moment, please trye later!',
        {description: 'Error connecting to the database!'}
      )
    }
    /**
     * Handle the user does not exist
     */
    if(!user){
      throw new BadRequestException("The user id does not exist")
    }
    return user;
  }

  public async createMany( createManyUsersDto: CreateManyUsersDto){
   return await this.usersCreateManyProvider.createMany(createManyUsersDto)
  }
}
