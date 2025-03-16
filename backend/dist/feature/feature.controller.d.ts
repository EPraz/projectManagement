import { FeatureService } from './feature.service';
import { CreateFeatureDto, GetAllFeaturesDto, UpdateFeatureDto } from 'src/dto';
import { Feature } from '@prisma/client';
export declare class FeatureController {
    private readonly featureService;
    constructor(featureService: FeatureService);
    create(request: CreateFeatureDto): Promise<Feature>;
    findAll(request: GetAllFeaturesDto): Promise<Feature[]>;
    findOne(id: string): Promise<Feature | null>;
    update(id: string, request: UpdateFeatureDto): Promise<Feature>;
    delete(id: string): Promise<boolean>;
}
