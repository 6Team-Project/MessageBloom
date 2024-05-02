import { useState } from 'react';
import '../styles/List/List.scss';
import ListCard from '../components/List/ListCard';
import list from '../mock-data.json';

const mock = [
  {
    id: 1,
    name: '조현지',
    backgroundColor: 'orange',
    backgroundImageURL: '',
    createAt: '2024-05-01',
    messageCount: '1',
    recentMessage: '',
    reactionCount: 0,
    topReactions: '',
  },
];

export default function List() {
  const [data, setData] = useState(list.list);

  const getBestCards = () => {
    const sortedCards = [...data];
    sortedCards.sort((a, b) => b.messageCount - a.messageCount);
    return sortedCards.slice(0, 10);
  };

  const getLatestCards = () => {
    const sortedCards = [...data];
    sortedCards.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return sortedCards;
  };

  const bestCards = getBestCards();
  const latestCards = getLatestCards();

  return (
    <div className='list'>
      <div className='list__best'>
        <p className='list__best-title'>인기 롤링 페이퍼 🔥</p>
        <div className='list__best-cards'>
          {bestCards.map((card) => (
            <ListCard key={card.id} {...card} />
          ))}
        </div>
      </div>

      <div className='list__newest'>
        <p className='list__newest-title'>최근에 만든 롤링 페이퍼 ⭐️</p>
        <div className='list__newest-cards'>
          {latestCards.map((card) => (
            <ListCard key={card.id} {...card} />
          ))}
        </div>
      </div>

      <button className='list__create-btn'>나도 만들어보기</button>
    </div>
  );
}
