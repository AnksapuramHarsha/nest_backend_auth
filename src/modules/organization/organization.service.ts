import { Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';


@Injectable()
export class OrganizationService {
  create(createOrganizationDto: CreateOrganizationDto) {

    return createOrganizationDto;
  }

  findAll() {
    return `This action returns all organization`;
  }

  findOne(id: number) {
    return `This action returns a #${id} organization`;
  }

//   update( updateOrganizationDto: UpdateOrganizationDto) {
//     return updateOrganizationDto;
//   }

  remove(id: number) {
    return `This action removes a #${id} organization`;
  }
}
