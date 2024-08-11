import {atom} from 'recoil';
export enum Categories {
  'DEFAULT' = 'DEFAULT',
  'CAFE' = 'CAFE',
  'ALCOHOL' = 'ALCOHOL',
  'FOOD' = 'FOOD',
}

const categoryAtom = atom<Categories>({
  key: 'categoryAtom',
  default: Categories.DEFAULT,
});

// export default 사용, atom만 익스포트
export default categoryAtom;
