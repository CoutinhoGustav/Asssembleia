import { Injectable, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemStatus } from './entities/system-status.entity';

import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class SystemStatusService {
    constructor(
        @InjectRepository(SystemStatus)
        private readonly repo: Repository<SystemStatus>,
        @Optional() private readonly eventsGateway?: EventsGateway,
    ) { }

    async getStatus() {
        let status = await this.repo.findOne({ where: { id: 'main' } });
        if (!status) {
            status = await this.repo.save({ id: 'main', isCallActive: false });
        }
        return status;
    }

    async toggleCall(active: boolean) {
        const status = await this.getStatus();
        status.isCallActive = active;
        const savedStatus = await this.repo.save(status);
        // Emitir evento WebSocket apenas quando o gateway está disponível (não na Vercel)
        if (this.eventsGateway) {
            this.eventsGateway.emitSystemStatusChange(active);
        }
        return savedStatus;
    }
}
