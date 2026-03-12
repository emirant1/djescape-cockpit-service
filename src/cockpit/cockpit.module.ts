import { Module } from '@nestjs/common';
import { EventModule } from './event/event.module';
import { AboutModule } from './about/about.module';
import { ReferencesModule } from './references/references.module';

@Module({
  imports: [EventModule, AboutModule, ReferencesModule],
})
export class CockpitModule {}
