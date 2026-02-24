import { Module } from '@nestjs/common';
import { AssemblyController } from './assembly.controller';
import { StudentsModule } from '../students/students.module';
import { SystemStatusModule } from '../system-status/system-status.module';
import { AttendancesModule } from '../attendances/attendances.module';

@Module({
    imports: [StudentsModule, SystemStatusModule, AttendancesModule],
    controllers: [AssemblyController],
})
export class AssemblyModule { }
