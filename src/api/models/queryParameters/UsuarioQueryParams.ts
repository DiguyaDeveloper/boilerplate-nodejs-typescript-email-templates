import { FindConditions, FindManyOptions, Like } from 'typeorm';

import Pagination from '../../shared/Pagination';
import Specification from '../../shared/Specification';
import { User } from '../user-models/User.model';

export default class UsuarioQueryParams
  extends Pagination
  implements Specification<User> {
  public lastName?: string;

  public getOptions(): FindManyOptions<User> {
    const where: FindConditions<User> = {};

    if (this.lastName) {
      where.lastName = Like(`%${this.lastName}%`);
    }

    return this.paginate({
      where,
    });
  }
}
