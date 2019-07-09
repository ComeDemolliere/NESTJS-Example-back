import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique} from 'typeorm';

@Entity()
export class Guest extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    company: string;

    @Column()
    logo: string;
}
