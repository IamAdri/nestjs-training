import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { AuthService } from 'src/auth/providers/auth.service';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';

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
  ) {}
  /**
   *The method to get all users from the database
   */
  public async createUser(createUserDto: CreateUserDto) {
    //Check if user already exists with same email
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    //Handle exception
    //Create a new user
    let newUser = this.usersRepository.create(createUserDto);
    newUser = await this.usersRepository.save(newUser);
    return newUser;
  }

  public findAll(
    getUsersParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
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
  return await this.usersRepository.findOneBy({
    id
  })
  }

}
