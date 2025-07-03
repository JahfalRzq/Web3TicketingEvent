import { IsDate, IsString,IsUppercase } from "class-validator";
import { Entity,PrimaryGeneratedColumn,Column,CreateDateColumn,UpdateDateColumn,DeleteDateColumn, OneToMany, Collection,Int32, Decimal128, ManyToOne, JoinColumn } from "typeorm";
import { Event } from "./Event";
import { User } from "./User";

export enum statusTransaction{
    active = "active",
    transferred = "transferred",
    redeemed ="redeemed"
}


@Entity()
export class Ticket{
    @PrimaryGeneratedColumn('uuid')
    public id : string

    
    @Column({
        default : null,
        nullable : true
    })
    @IsString()
    public tokenId : string


    @Column({
        type: 'enum',
        enum: statusTransaction,
    })
    @IsString()
    @IsUppercase()
    public status: statusTransaction


    @Column({
        default : null,
        nullable : true
    })
    @IsString()
    public tx_hash : string


    @Column({
    default : null,
    nullable : true
    })
    @IsDate()
    public minted_at : Date


    @CreateDateColumn()
    public createdAt: Date

    @UpdateDateColumn()
    public updatedAt: Date

    @DeleteDateColumn()
    public deletedAt: Date


    @ManyToOne (() => Event, (event_id) => event_id.tickets)
    @JoinColumn()
    public event_id : Event


    @ManyToOne(() => User, (owner_id) => owner_id.users)
    @JoinColumn()
    public owner_id : User
    



}
