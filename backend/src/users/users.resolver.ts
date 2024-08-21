import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dtos/user.dtos';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query((returns) => [User])
  async me(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Mutation((returns) => User)
  async createUser(@Args('input') createUser: CreateUserInput): Promise<User> {
    return this.usersService.createUser(createUser);
  }
}