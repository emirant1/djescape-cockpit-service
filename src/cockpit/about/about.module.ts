import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AboutController } from './controller/about.controller';
import { AboutService } from './service/about.service';
import { About } from './entity/about.entity';
import { AboutMapper } from './mapper/about.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([About])],
  controllers: [AboutController],
  providers: [AboutService, AboutMapper],
})
export class AboutModule {}
