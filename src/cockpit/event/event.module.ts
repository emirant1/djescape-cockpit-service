import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventController } from './event.controller';
import { EventService } from './service/event.service';
import { Event } from './entity/event.entity';
import { EventMapper } from './mapper/event.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  controllers: [EventController],
  providers: [EventService, EventMapper],
})
export class EventModule {}
