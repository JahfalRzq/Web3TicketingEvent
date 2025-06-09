import { IsDate, IsString,IsUppercase } from "class-validator";
import { Entity,PrimaryGeneratedColumn,Column,CreateDateColumn,UpdateDateColumn,DeleteDateColumn, OneToMany, Collection } from "typeorm";


export enum categoryEvent {
    BLOCKCHAIN = 'BLOCKCHAIN',
    KRIPTO = 'KRIPTO',
    DEFI = 'DEFI',
    NFT = 'NFT',
    Web3 = 'Web3',
    JobsHunter = 'JobsHunter',
    AirdropHunter = 'AirdropHunter',
}


export enum typeEvent {
    Nasional = 'Nasional',
    Internasional = 'Internasional'
}

@Entity()
export class Event{
    @PrimaryGeneratedColumn('uuid')
    public id : string

    @Column({
        default : null,
        nullable : true
    })
    @IsString()
    public nameEvent : string

    @Column({
    default : null,
    nullable : true
    })
    @IsDate()
    public dateEvent : Date

    @Column({
    default : null,
    nullable : true
    })
    @IsString()
    public alamatEvent : String

    @Column({
        default : null,
        nullable : true
    })
    @IsString()
    public image : string

    @Column({
        type: 'enum',
        enum: categoryEvent,
    })
    @IsString()
    @IsUppercase()
    public categoryEvent: categoryEvent

    @Column({
        type: 'enum',
        enum: typeEvent,
    })
    @IsString()
    @IsUppercase()
    public typeEvent: typeEvent


    @CreateDateColumn()
    public createdAt: Date

    @UpdateDateColumn()
    public updatedAt: Date

    @DeleteDateColumn()
    public deletedAt: Date
    
    
    }