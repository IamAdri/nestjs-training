import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { AuthService } from 'src/auth/providers/auth.service';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import type { ConfigType } from '@nestjs/config';
import profileConfig from '../config/profile.config';

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
    if (!newUser) {
      throw new BadRequestException(
        'The user could not be created, please ty again!',
      );
    }
    newUser = await this.usersRepository.save(newUser);
    return newUser;
  }

  public findAll(
    getUsersParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    //test the new config
    console.log(this.profileConfiguration);
    console.log(this.profileConfiguration.apiKey);
    //Auth Service
    const isAuth = this.authService.isAuth();
    console.log(isAuth);
    return [
      { firstName: 'John', email: 'john@gmail.com' },
      { firstName: 'Adri', email: 'adri@gmail.com' },
    ];
  }
  /**
   * Find a single user based on id
   */
  //Find user by id
  public async findOneById(id: number) {
    try {
      return await this.usersRepository.findOneBy({
        id,
      });
    } catch (error) {
      throw new BadRequestException(
        'The user could not be created, please ty again!',
      );
    }
  }
}
