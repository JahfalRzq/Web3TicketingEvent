import { IsString,IsUppercase } from "class-validator";
import { Entity,PrimaryGeneratedColumn,Column,CreateDateColumn,UpdateDateColumn,DeleteDateColumn, OneToMany } from "typeorm";
import bcrypt from 'bcryptjs';
import { Event } from "./Event";
import { Ticket } from "./Ticket";


export enum UserRole {
    ADMIN = 'ADMIN',
    USER = 'USER',
    EVENTORGANIZER = 'EVENTORGANIZER',

}

@Entity()
export class User{

    @PrimaryGeneratedColumn('uuid')
    public id : string

    
    @Column({
        default: null,
        nullable: true
    })
    @IsString()
    public namaLengkap: string

    @Column({
        default : null,
        nullable : true
    })
    @IsString()
    public walletAddress : string

    @Column({
        default: null,
        nullable: true
    })
    @IsString()
    public userName: string

    @Column({
        default: null,
        nullable: true
    })
    @IsString()
    public password: string


    @Column({
        type: 'enum',
        enum: UserRole,
    })
    @IsString()
    @IsUppercase()
    public role: UserRole

    

    @CreateDateColumn()
    public createdAt: Date

    @UpdateDateColumn()
    public updatedAt: Date

    @DeleteDateColumn()
    public deletedAt: Date


    public hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8)
    }

    public checkIfPasswordMatch(unencryptedPassword: string): boolean {
        return bcrypt.compareSync(unencryptedPassword, this.password)
    }

    @OneToMany(() => Event, (events) => events.userOrganizer)
    public events : Event[]

    @OneToMany (() => Ticket, (users) => users.owner_id)
    public users : Ticket[]
}