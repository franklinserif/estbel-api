import { Injectable } from '@nestjs/common';
import { CreateUserModuleAccessDto } from './dto/create-user-module-access.dto';
import { UpdateUserModuleAccessDto } from './dto/update-user-module-access.dto';

@Injectable()
export class UserModuleAccessService {
  create(createUserModuleAccessDto: CreateUserModuleAccessDto) {
    return 'This action adds a new userModuleAccess';
  }

  findAll() {
    return `This action returns all userModuleAccess`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userModuleAccess`;
  }

  update(id: number, updateUserModuleAccessDto: UpdateUserModuleAccessDto) {
    return `This action updates a #${id} userModuleAccess`;
  }

  remove(id: number) {
    return `This action removes a #${id} userModuleAccess`;
  }
}
