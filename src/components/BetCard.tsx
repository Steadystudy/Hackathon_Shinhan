import { Flex } from 'antd';
import AvatarProfile from './AvatarProfile';

interface BetCardProps {
  myTeam: any; // 유저 배열
  opponentTeam: any; // 유저배열
  betMoney: number;
  title: string;
}

export default function BetCard() {
  return (
    <Flex className="w-80 h-36 bg-blue300 rounded-lg" wrap>
      <Flex className="w-1/3 pl-2">
        <AvatarProfile name="김아무" />
      </Flex>
      <Flex vertical className="w-1/3 items-center justify-center gap-8">
        <h2 className="font-semibold text-2xl text-white">골프 내기</h2>
        <h2 className="font-semibold text-xl text-white">100,000원</h2>
      </Flex>
      <Flex className="w-1/3 pr-2 justify-end">
        <AvatarProfile name="이아무" />
      </Flex>
    </Flex>
  );
}
