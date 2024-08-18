import {atom} from 'recoil';
import {Categories} from '../category/atom';

export interface IPlace {
  id: number;
  category: Categories;
  title: string;
  location: string;
  imageUrl: string;
}
const placeAtom = atom<IPlace[]>({
  key: 'placeAtom',
  default: [
    {
      id: 1,
      category: Categories.CAFE,
      title: '장소 이름',
      location: '제주 서귀포시 | CAFE',
      imageUrl: 'https://example.com/image1.jpg',
    },
    {
      id: 2,
      category: Categories.CAFE,
      title: '장소 이름',
      location: '제주 서귀포시 | CAFE',
      imageUrl: 'https://example.com/image2.jpg',
    },
    {
      id: 3,
      category: Categories.CAFE,
      title: '장소 이름',
      location: '제주 서귀포시 | CAFE',
      imageUrl: 'https://example.com/image3.jpg',
    },
    {
      id: 4,
      category: Categories.CAFE,
      title: '장소 이름',
      location: '제주 서귀포시 | CAFE',
      imageUrl: 'https://example.com/image4.jpg',
    },
  ],
});

export default placeAtom;
