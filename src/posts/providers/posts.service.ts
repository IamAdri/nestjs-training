import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/providers/users.service';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { CreatePostDto } from '../dtos/create-post.dto';
import { MetaOption } from 'src/meta-options/meta-option.entity';

@Injectable()
export class PostsService {
  constructor(
    /**
     * Injecting post repository
     */
       @InjectRepository(Post)
   private readonly postsRepository: Repository<Post>,
   /**
    * Inject metaOption respository
    */
   @InjectRepository(MetaOption)
   public readonly metaOptionsRepository: Repository<MetaOption>,
   // Inject Users Service
    private readonly usersService: UsersService,
  ) {}

  public async findAll(userId: string) {
    //Users Service
    //Find User
let posts = await this.postsRepository.find({
  relations: {
    metaOptions: true,
   // author: true
  }
});
return posts;
  }
/**
 * Creating new posts
 **/
   public async create(createPostDto: CreatePostDto) {
    //Find author from database based on authorId
    let author = await this.usersService.findOneById(createPostDto.authorId)
    //Create post
    if(author){
let post = this.postsRepository.create({...createPostDto, author: author});
    //return the post
   return await this.postsRepository.save(post);
    } 
    }

    public async delete(id: number){
      //Delete the post
      await this.postsRepository.delete(id)
      //Confirmations
    return {deleted: true, id}
    }
}
