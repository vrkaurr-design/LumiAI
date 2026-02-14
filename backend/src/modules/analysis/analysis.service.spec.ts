import { Test, TestingModule } from '@nestjs/testing';
import { AnalysisService } from './analysis.service';
import { ImageAnalyzerService } from './services/image-analyzer.service';
import { PrismaService } from '../../prisma/prisma.service';
import { UploadModule } from '../upload/upload.module';
import { StorageService } from '../../common/services/storage.service';

describe('AnalysisService', () => {
    let service: AnalysisService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AnalysisService,
                {
                    provide: ImageAnalyzerService,
                    useValue: {
                        analyzeImage: jest.fn().mockResolvedValue({ tone: 'WARM', skinType: 'OILY' })
                    }
                },
                { provide: PrismaService, useValue: {} },
                { provide: StorageService, useValue: {} }
            ],
        }).compile();

        service = module.get<AnalysisService>(AnalysisService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
