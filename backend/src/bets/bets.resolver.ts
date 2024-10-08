import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { BetsService } from './bets.service';
import { Bet } from './entities/bet.entity';
import {
  JudgeBetInput,
  JudgeBetOutput,
  CreateBetInput,
  CreateBetOutput,
  PendingBet,
  Roles,
  SendMoneyInput,
  SendMoneyOutput,
  GetBetInput,
  GetBetOutput,
} from './dtos/bet.dto';
import { AuthUser } from 'src/decorators/AuthUser.decorator';
import { Inject } from '@nestjs/common';
import { PUB_SUB } from 'src/common/common.module';
import { PubSub } from 'graphql-subscriptions';
import { BET_RESULT, BETTED, CANCELED, PENDING_BET } from 'src/common/constants';
import { User } from 'src/users/entities/user.entity';

@Resolver()
export class BetsResolver {
  constructor(
    private readonly betsService: BetsService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Query((returns) => [Bet])
  async bets(): Promise<Bet[]> {
    return this.betsService.findAll();
  }

  @Query((returns) => GetBetOutput)
  async getBetById(@Args('input') { betId }: GetBetInput): Promise<GetBetOutput> {
    return await this.betsService.getBetById(betId);
  }

  @Mutation((returns) => SendMoneyOutput)
  async sendMoney(
    @AuthUser() authUser: User,
    @Args('input') sendMoneyInput: SendMoneyInput,
  ): Promise<SendMoneyOutput> {
    return await this.betsService.sendMoney(authUser, sendMoneyInput);
  }

  @Mutation((returns) => CreateBetOutput)
  async createBet(
    @AuthUser() authUser: User,
    @Args('input') createBetInput: CreateBetInput,
  ): Promise<CreateBetOutput> {
    return await this.betsService.createBet(authUser, createBetInput);
  }

  @Mutation((returns) => CreateBetOutput)
  async judgeBet(
    @AuthUser() authUser: User,
    @Args('input') chooseBetInput: JudgeBetInput,
  ): Promise<JudgeBetOutput> {
    return this.betsService.judgeBet(authUser, chooseBetInput);
  }

  // 생성 및 초대 알림
  @Subscription((returns) => PendingBet, {
    filter: ({ pendingBet: { bet } }, _, { user }) => {
      return (
        bet.membersJoined.map((user: User) => user.id).includes(user.id) || user.id == bet.judgeId
      );
    },
    resolve: ({ pendingBet: { bet } }, _, { user }) => {
      return {
        bet,
        role:
          user.id === bet.judgeId
            ? Roles.JUDGE
            : user.id === bet.creatorId
              ? Roles.CREATOR
              : Roles.PARTICIPANT,
      };
    },
  })
  pendingBet() {
    return this.pubSub.asyncIterator(PENDING_BET);
  }

  // 결과 안내 알림
  @Subscription((returns) => Bet, {
    filter: ({ pendingBet: { bet } }, _, { user }) => {
      return bet.membersJoined.map((user) => user.id).includes(user.id);
    },
    resolve: ({ pendingBet: { bet } }) => {
      return bet;
    },
  })
  betResult() {
    return this.pubSub.asyncIterator(BET_RESULT);
  }

  // 모금 완료 알림
  @Subscription((returns) => Bet, {
    filter: ({ bet }, _, { user }) => {
      return bet.membersJoined.map((user) => user.id).includes(user.id) || bet.judgeId === user.id;
    },
    resolve: ({ bet }) => {
      return bet;
    },
  })
  betted() {
    return this.pubSub.asyncIterator(BETTED);
  }

  // 내기 취소 알림
  @Subscription((returns) => Bet, {
    filter: ({ bet }, _, { user }) => {
      return bet.membersJoined.map((user) => user.id).includes(user.id) || bet.judgeId === user.id;
    },
    resolve: ({ bet }) => {
      return bet;
    },
  })
  canceled() {
    return this.pubSub.asyncIterator(CANCELED);
  }
}
