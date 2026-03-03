import {
  BadRequestException,
  Body,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/providers/users.service';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { CreatePostDto } from '../dtos/create-post.dto';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { Tag } from 'src/tags/tag.entity';
import { GetPostsDto } from '../dtos/get-posts.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';

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
    private readonly metaOptionsRepository: Repository<MetaOption>,
    // Inject Users Service
    private readonly usersService: UsersService,
    /**
     * Inject tags service
     */
    private readonly tagsService: TagsService,
    /**
     * Inject PaginationProvider
     */
    private readonly paginationProvider: PaginationProvider,
  ) {}

  public async findAll(
    postQuery: GetPostsDto,
    userId: string,
  ): Promise<Paginated<Post>> {
    //Users Service
    //Find User
    let posts = await this.paginationProvider.paginateQuery(
      {
        limit: postQuery.limit,
        page: postQuery.page,
      },
      this.postsRepository,
    );
    return posts;
  }
  public async update(patchPostDto: PatchPostDto) {
    let tags: Tag[] | null;
    // let tags;
    //Find the tags
    try {
      tags = await this.tagsService.findMultipleTags(patchPostDto.tags);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please trye later!',
        { description: 'Error connecting to the database!' },
      );
    }
    /**
     * Number of tags should be equal
     */
    if (!tags || tags.length !== patchPostDto.tags?.length)
      throw new BadRequestException('Can not find the tags!');

    //Find the post
    let post: Post | null;
    try {
      post = await this.postsRepository.findOneBy({
        id: patchPostDto.id,
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please trye later!',
        { description: 'Error connecting to the database!' },
      );
    }
    if (!post) throw new BadRequestException('Can not find the post!');

    //Update the properties
    if (post) {
      post.title = patchPostDto.title ?? post.title;
      post.content = patchPostDto.content ?? post.content;
      post.status = patchPostDto.status ?? post.status;
      post.postType = patchPostDto.postType ?? post.postType;
      post.slug = patchPostDto.slug ?? post.slug;
      post.featuredImageUrl =
        patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
      post.publishOn = patchPostDto.publishOn ?? post.publishOn;
      //My version
      //post.tags = tags ?? post.tags;
    }
    //Assign the new tags
    //Mentor`s version
    if (post) post.tags = tags;
    //Save the post and return
    try {
      await this.postsRepository.save(post);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please trye later!',
        { description: 'Error connecting to the database!' },
      );
    }
    return post;
  }
  /**
   * Creating new posts
   **/
  public async create(createPostDto: CreatePostDto) {
    //Find author from database based on authorId
    const author = await this.usersService.findOneById(createPostDto.authorId);
    //Find tags
    const tags =
      createPostDto?.tags &&
      (await this.tagsService.findMultipleTags(createPostDto.tags));
    //Create post
    if (author) {
      const post = this.postsRepository.create({
        ...createPostDto,
        author: author,
        tags: tags,
      });
      //return the post
      return await this.postsRepository.save(post);
    }
  }

  public async delete(id: number) {
    //Delete the post
    await this.postsRepository.delete(id);
    //Confirmations
    return { deleted: true, id };
  }
}
