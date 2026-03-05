import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import type { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { TagsService } from 'src/tags/providers/tags.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { User } from 'src/users/user.entity';
import {
  BadRequestException,
  Body,
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { Tag } from 'src/tags/tag.entity';

@Injectable()
export class CreatePostProvider {
  constructor(
    /**
     * Injecting post repository
     */
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    // Inject Users Service
    private readonly usersService: UsersService,
    /**
     * Inject tags service
     */
    private readonly tagsService: TagsService,
  ) {}
  public async createPost(createPostDto: CreatePostDto, user: ActiveUserData) {
    //Find author from database based on authorId
    let author: User | undefined;
    let tags: Tag[] | undefined;
    try {
      author = await this.usersService.findOneById(user.sub);
      //Find tags
      tags = await this.tagsService.findMultipleTags(createPostDto.tags);
    } catch (error) {
      throw new ConflictException(error);
    }

    if (createPostDto.tags.length !== tags.length) {
      throw new BadRequestException('Please check your tag Ids!');
    }

    //Create post
    if (author) {
      const post = this.postsRepository.create({
        ...createPostDto,
        author: author,
        tags: tags,
      });
      //return the post
      try {
        return await this.postsRepository.save(post);
      } catch (error) {
        throw new ConflictException(error, {
          description: 'Ensure post slug is unique and not a duplicate!',
        });
      }
    }
  }
}
