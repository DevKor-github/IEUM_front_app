import {atom} from 'recoil';
export enum Categories {
  'FOOD' = 'FOOD',
  'CAFE' = 'CAFE',
  'ALCOHOL' = 'ALCOHOL',
  'MUSEUM' = 'MUSEUM',
  'STAY' = 'STAY',
  'SHOPPING' = 'SHOPPING',
  'OTHERS' = 'OTHERS',
}

const categoryAtom = atom<Categories[]>({
  key: 'categoryAtom',
  default: [],
});

// export default 사용, atom만 익스포트
export default categoryAtom;
