import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class PostsService {
  constructor(
    /**
     * Injecting post repository
     */
    //   @InjectRepository(Post)
    //   private postsRepository: Repository<Post>,
    //Inject Users Service
    private readonly usersService: UsersService,
  ) {}

  public findAll(userId: string) {
    //Users Service
    const user = this.usersService.findOneById(userId);
    //Find User

    return [
      {
        user: user,
        title: 'Test',
        content: 'HBKJFHDEGJRLEKGHK',
      },
      {
        user: user,
        title: 'Testdgrtu54',
        content: '111111111111111111111',
      },
    ];
  }

  // public createPost() {
  //   let newPost = this.postsRepository.create(CreatePostDto);
  ///   newPost = await this.postsRepository.save(newPost);
  //  return newPost;
  //  }
}
