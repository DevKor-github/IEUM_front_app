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
    case 'FOOD':
      return Categories.FOOD;
    case 'CAFE':
      return Categories.CAFE;
    case 'ALCOHOL':
      return Categories.ALCOHOL;
    case 'MUSEUM':
      return Categories.MUSEUM;
    case 'STAY':
    case 'Hostel':
      return Categories.STAY;
    case 'Shopping':
    case 'SHOPPING':
      return Categories.SHOPPING;
    default:
      return Categories.OTHERS;
  }
};
export const mapEnumToServerCategory = (category: Categories): string => {
  switch (category) {
    case Categories.FOOD:
      return 'Restaurant';
    case Categories.CAFE:
      return 'Cafe';
    case Categories.ALCOHOL:
      return 'Bar';
    case Categories.MUSEUM:
      return 'Culture';
    case Categories.STAY:
      return 'Stay';
    case Categories.SHOPPING:
      return 'Shopping';
    default:
      return '';
  }
};

const categoryAtom = atom<Categories[]>({
  key: 'categoryAtom',
  default: [],
});

// export default 사용, atom만 익스포트
export default categoryAtom;
