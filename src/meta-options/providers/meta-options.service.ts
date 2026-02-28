import { Repository } from "typeorm";
import { MetaOption } from "../meta-option.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreatePostMetaOptionsDto } from "../dtos/create-post-meta-options.dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MetaOptionsService{
    constructor(
        /**
         * Injecting meta-option repository
         */
        @InjectRepository(MetaOption)
        private readonly metaOptionsRepository: Repository<MetaOption>
    ){}
    public async create(createPostMetaOptionsDto: CreatePostMetaOptionsDto){
        let metaOption = this.metaOptionsRepository.create(createPostMetaOptionsDto);
      return await this.metaOptionsRepository.save(metaOption)
    }
}