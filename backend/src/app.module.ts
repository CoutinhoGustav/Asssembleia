import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StudentsModule } from './students/students.module';
import { AttendancesModule } from './attendances/attendances.module';
import { ReportsModule } from './reports/reports.module';
import { AdminModule } from './admin/admin.module';
import { SystemStatusModule } from './system-status/system-status.module';
import { AssemblyModule } from './assembly/assembly.module';
import { EventsModule } from './events/events.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const url = configService.get<string>('DATABASE_URL');
                return {
                    type: 'postgres',
                    url: url,
                    autoLoadEntities: true,
                    synchronize: true, // Apenas para desenvolvimento
                    ssl: url?.includes('supabase') || url?.includes('neon') || url?.includes('require')
                        ? { rejectUnauthorized: false }
                        : false,
                };
            },
        }),
        StudentsModule,
        AttendancesModule,
        ReportsModule,
        AdminModule,
        SystemStatusModule,
        AssemblyModule,
        EventsModule,
    ],
})
export class AppModule { }
