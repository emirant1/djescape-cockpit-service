import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReferencesController } from './references.controller';
import { ReferencesService } from './references.service';
import { Reference } from './entities/reference.entity';
import { ReferenceMapper } from './mapper/reference.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([Reference])],
  controllers: [ReferencesController],
  providers: [ReferencesService, ReferenceMapper],
})
export class ReferencesModule {}
