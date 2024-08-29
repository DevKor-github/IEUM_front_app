import {atom} from 'recoil';
import {Categories} from '../category/atom';
import {Regions} from '../region/atom';

export interface IPlace {
  id: number;
  category: Categories;
  region: Regions;
  title: string;
  location: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  hashtag: string[];
}

export enum PlaceConvenience {
  PARK = '주차',
  DOG = '반려동물 동반',
  GROUP = '단체석',
  TAKEOUT = '포장',
  DELIVERY = '배달',
  RESERVATION = '예약',
}

const placeAtom = atom<IPlace[]>({
  key: 'placeAtom',
  default: [
    {
      id: 1,
      category: Categories.CAFE,
      region: Regions.SEOUL,
      title: '장소 이름',
      location: '제주 서귀포시 | CAFE',
      imageUrl: 'https://example.com/image1.jpg',
      latitude: 37.359972,
      longitude: 127.104916,
      hashtag: ['대형카페', 'sns 핫플'],
    },
    {
      id: 2,
      category: Categories.CAFE,
      region: Regions.SEOUL,
      title: '장소 이름',
      location: '제주 서귀포시 | CAFE',
      imageUrl: 'https://example.com/image2.jpg',
      latitude: 37.350899,
      longitude: 127.104916,
      hashtag: ['대형카페', 'sns 핫플'],
    },
    {
      id: 3,
      category: Categories.CAFE,
      region: Regions.SEOUL,
      title: '장소 이름',
      location: '제주 서귀포시 | CAFE',
      imageUrl: 'https://example.com/image3.jpg',
      latitude: 37.359,
      longitude: 127.104916,
      hashtag: ['대형카페', 'sns 핫플'],
    },
    {
      id: 4,
      category: Categories.CAFE,
      region: Regions.SEOUL,
      title: '장소 이름',
      location: '제주 서귀포시 | CAFE',
      imageUrl: 'https://example.com/image4.jpg',
      latitude: 37.36998,
      longitude: 127.1049,
      hashtag: ['대형카페', 'sns 핫플'],
    },
  ],
});

export default placeAtom;
