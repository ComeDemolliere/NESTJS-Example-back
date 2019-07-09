import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, OneToOne, JoinColumn} from 'typeorm';
import { UserRole } from '../users/user-role.enum';
import { Guest } from './guest.entity';

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    salt: string;

    @Column()
    role: UserRole;

    @OneToOne(type => Guest)
    @JoinColumn()
    guestInfo: Guest;
}
