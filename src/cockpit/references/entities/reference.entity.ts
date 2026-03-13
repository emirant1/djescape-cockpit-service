import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Category {
  NIGHT_CLUBS = 'nichtclubs',
  COMPANIES = 'companies',
  SPECIALS = 'specials',
  FESTIVALS = 'festivals',
  ARTISTS = 'artists',
}

@Entity({ schema: 'cockpit', name: 'references' })
export class Reference {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title?: string;

  @Column({ type: 'varchar', length: 500 })
  url: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: Category })
  category: Category;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
