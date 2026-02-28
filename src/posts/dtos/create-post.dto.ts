import {
  IsArray,
  IsEnum,
  IsInt,
  IsISO8601,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { postType } from '../enums/postType.enum';
import { postStatus } from '../enums/postStatus.enum';
import { CreatePostMetaOptionsDto } from '../../meta-options/dtos/create-post-meta-options.dto';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'This is the title for the bolg post',
    example: 'This is title',
  })
  @IsString()
  @MaxLength(512)
  @MinLength(4)
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    enum: postType,
    description: 'Possible values: "post", "page", "story", "series"',
  })
  @IsEnum(postType)
  @IsNotEmpty()
  postType: postType;

  @ApiProperty({
    description: "For example: 'my-url'",
    example: 'my-blog-post',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'A slug should be all small letters and uses only "-" and without getHeapSpaceStatistics. For example "my-url"',
  })
  @MaxLength(256)
  slug: string;

  @ApiProperty({
    enum: postStatus,
    description: "Possible values: 'draft', 'scheduled', 'review', 'published'",
  })
  @IsEnum(postStatus)
  @IsNotEmpty()
  status: postStatus;

  @ApiPropertyOptional({
    description: 'This is the content of the post',
    example: 'Post content',
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    description:
      'Serialize your JSON object else a validation error will be thrown',
    example:
      '{\r\n  "@context": "https://schema.org",\r\n  "@type": "BlogPosting",\r\n  "headline": "Exploring the Hidden Lakes",\r\n  "description": "A short weekend adventure to discover remote mountain lakes and enjoy nature.",\r\n  "author": {\r\n    "@type": "Person",\r\n    "name": "Alex Morgan"\r\n  },\r\n  "datePublished": "2026-02-25T14:32:10Z",\r\n  "keywords": ["travel", "nature", "weekend"]\r\n}',
  })
  @IsOptional()
  @IsJSON()
  schema?: string;

  @ApiPropertyOptional({
    description: 'Featured Img for ypou blog post',
    example: 'https://cdn.example.com/images/hidden-lakes-47291.jpg',
  })
  @IsUrl()
  @IsOptional()
  @MaxLength(1024)
  featuredImageUrl?: string;

  @ApiPropertyOptional({
    description: 'The date on which the blog post is published',
    example: '2025-02-25T07:46:32+0000',
  })
  @IsISO8601()
  @IsOptional()
  publishOn?: Date;

  @ApiPropertyOptional({
    description: 'Array of tags past as string values',
    example: ['post', 'Adri'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MinLength(3, { each: true })
  tags?: string[];

  @ApiPropertyOptional({
    type: CreatePostMetaOptionsDto,
    required: false,
    items: {
      type: 'object',
      properties: {
        metaValue: {
          type: 'json',
          description:
            'The metaValue is a JSON string',
          example: '{"sidebarEnabled":true}',
        },
      },
    },
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreatePostMetaOptionsDto)
  metaOptions?: CreatePostMetaOptionsDto

  @ApiProperty({
    type: 'integer',
    required: true,
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  authorId: number;
}
