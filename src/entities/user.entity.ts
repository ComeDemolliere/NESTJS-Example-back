import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, OneToOne, JoinColumn} from 'typeorm';
import { UserRole } from '../users/user-role.enum';
import { Guest } from './guest.entity';
import * as bcrypt from 'bcrypt';

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

    async validatePassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
    }
}
