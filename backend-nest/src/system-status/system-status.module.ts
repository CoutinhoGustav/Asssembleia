import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemStatusService } from './system-status.service';
import { SystemStatusController } from './system-status.controller';
import { SystemStatus } from './entities/system-status.entity';
import { EventsModule } from '../events/events.module';

const isVercel = process.env.VERCEL === '1';

@Module({
    imports: [
        TypeOrmModule.forFeature([SystemStatus]),
        ...(isVercel ? [] : [EventsModule]),
    ],
    controllers: [SystemStatusController],
    providers: [SystemStatusService],
    exports: [SystemStatusService],
})
export class SystemStatusModule { }
