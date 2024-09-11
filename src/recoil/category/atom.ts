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

export const mapServerCategoryToEnum = (serverCategory: string): Categories => {
  switch (serverCategory) {
    case 'Restaurant':
      return Categories.FOOD;
    case 'Cafe':
      return Categories.CAFE;
    case 'Bar':
      return Categories.ALCOHOL;
    case 'Museum':
      return Categories.MUSEUM;
    case 'Hotel':
    case 'Hostel':
      return Categories.STAY;
    case 'Shop':
    case 'Mall':
      return Categories.SHOPPING;
    default:
      return Categories.OTHERS;
  }
};

const categoryAtom = atom<Categories[]>({
  key: 'categoryAtom',
  default: [],
});

// export default 사용, atom만 익스포트
export default categoryAtom;
