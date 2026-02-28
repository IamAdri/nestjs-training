import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class AuthService {
  constructor(
    //Inject Users Service
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}
  public login(email: string, password: string, id: string) {
    //Check if user exists
    const user = this.usersService.findOneById(55);

    //login
    //token
    return 'SAMPLE_TOKEN';
  }

  public isAuth() {
    return true;
  }
}
