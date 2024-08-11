import {atom} from 'recoil';
import {Categories} from '../category/atom';

export interface IPlace {
  placeId: number;
  category: Categories;
}

const placeAtom = atom<IPlace[]>({
  key: 'placeAtom',
  default: [
    {
      placeId: 0,
      category: Categories.CAFE,
    },
  ],
});

export default placeAtom;
