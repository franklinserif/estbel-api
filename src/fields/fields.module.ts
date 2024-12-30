import { Module } from '@nestjs/common';
import { FieldsService } from './fields.service';
import { FieldsController } from './fields.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Field } from './entities/field.entity';
import { FieldValue } from './entities/field-value.entity';

@Module({
  controllers: [FieldsController],
  imports: [TypeOrmModule.forFeature([Field, FieldValue])],
  providers: [FieldsService],
  exports: [TypeOrmModule],
})
export class FieldsModule {}
