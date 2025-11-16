import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ServiceEntity } from 'src/@core/domain/entities';
import { Admin } from './admin';

@Entity('services')
export class Service {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column()
  active: boolean;

  @Column({ name: 'admin_id' })
  adminId: string;

  @ManyToOne(() => Admin)
  @JoinColumn({ name: 'admin_id' })
  admin: Admin;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;

  static fromDomain(serviceEntity: ServiceEntity) {
    const service = new Service();
    service.id = serviceEntity.id.value;
    service.name = serviceEntity.name;
    service.price = serviceEntity.price.value;
    service.active = serviceEntity.isActive();
    service.adminId = serviceEntity.adminId.value;
    service.createdAt = serviceEntity.createdAt;
    service.updatedAt = serviceEntity.updatedAt;
    return service;
  }

  toDomain(): ServiceEntity {
    return ServiceEntity.restore({
      id: this.id,
      name: this.name,
      price: this.price,
      active: this.active,
      adminId: this.adminId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}
