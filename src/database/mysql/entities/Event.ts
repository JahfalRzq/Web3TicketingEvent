import { IsDate, IsDecimal, IsInt, IsNumber, IsString,IsUppercase } from "class-validator";
import { Entity,PrimaryGeneratedColumn,Column,CreateDateColumn,UpdateDateColumn,DeleteDateColumn, OneToMany, Collection,Int32, Decimal128, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";
import { Ticket } from "./Ticket";


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
    public startDate : Date

    @Column({
    default : null,
    nullable : true
    })
    @IsDate()
    public endDate : Date

    @Column({
    default : null,
    nullable : true
    })
    @IsString()
    public alamatEvent : String

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


    @Column({
    default : null,
    nullable : true,
    type: 'int', // atau 'integer'
    })
    @IsNumber()
    public totalTicket : number

    @Column({
    default : null,
    nullable : true,
    })
    @IsDecimal()
    public ticketPrice : number

    
    @Column({
        nullable : false
    })
    @IsString()
    public contract_address : string

    @Column({
    nullable : false
    })
    @IsString()
    public location : string

        
    @Column({
        nullable : false
    })
    @IsString()
    public metadata_uri : string

    
    @Column({
    nullable : false
    })
    @IsString()
    public description : string

        
    @Column({
    nullable : false
    })
    @IsString()
    public image : string




    @CreateDateColumn()
    public createdAt: Date

    @UpdateDateColumn()
    public updatedAt: Date

    @DeleteDateColumn()
    public deletedAt: Date

    @ManyToOne (() => User, (userOrganizer) => userOrganizer.events)
    @JoinColumn()
    public userOrganizer : User

    @OneToMany(() => Ticket, (tickets) => tickets.event_id)
    public tickets : Ticket[]

    
    
    }