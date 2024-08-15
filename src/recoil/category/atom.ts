import {atom} from 'recoil';
export enum Categories {
  'CAFE' = 'CAFE',
  'ALCOHOL' = 'ALCOHOL',
  'MUSEUM' = 'MUSEUM',
  'STAY' = 'STAY',
  'SHOPPING' = 'SHOPPING',
  'OTHERS' = 'OTHERS',
}

const categoryAtom = atom<Categories[]>({
  key: 'categoryAtom',
  default: [], // todo category list로 변경
});

// export default 사용, atom만 익스포트
export default categoryAtom;
