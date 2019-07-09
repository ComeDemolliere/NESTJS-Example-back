import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UseGuards } from '@nestjs/common';

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'user',
    password: 'userpwd',
    database: 'TOMdatabase',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: false,
};
