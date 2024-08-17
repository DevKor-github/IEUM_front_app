import {atom} from 'recoil';

export enum Regions {
  SEOUL = '서울',
  GYEONGGI = '경기',
  INCHEON = '인천',
  BUSAN = '부산',
  DAEGU_GYEONGBUK = '대구/경북',
  ULSAN_GYEONGNAM = '울산/경남',
  GWANGJU_JEOLLA = '광주/전라',
  DAEJEON_SEJONG_CHUNGCHEONG = '대전/세종/충청',
  JEJU = '제주',
}

const regionAtom = atom<Regions[]>({
  key: 'regionAtom',
  default: [],
});

export default regionAtom;
