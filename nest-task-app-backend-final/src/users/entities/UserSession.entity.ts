import {
  Column,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm';
@Entity()
export class UserSession {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  userId: string;

  @Column()
  accessToken: string;

  @Column()
  accessTokenExpires: string;

  @Column()
  refreshAccessToken: string;

  @Column()
  refreshAccessTokenExpires: string;

}