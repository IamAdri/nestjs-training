import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Tag } from '../tag.entity';
import { CreateTagDto } from '../dtos/create-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagsService {
    constructor(
        /**
         * Inject tags repository
         */
        @InjectRepository(Tag)
        private readonly tagsRepository: Repository<Tag>
    ){}
    public async create(createTagDto: CreateTagDto){
        let tag = this.tagsRepository.create(createTagDto);
        return await this.tagsRepository.save(tag)
    }
}
