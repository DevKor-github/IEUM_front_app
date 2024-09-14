import {atom} from 'recoil';
import {Categories} from '../category/atom';
import {Regions} from '../region/atom';
import {exp} from '@gorhom/bottom-sheet/lib/typescript/utilities/easingExp';

export interface IPlace {
  id: number;
  name: string;
  address: string;
  simplifiedAddress: string;
  roadAddress: string;
  phone: string;
  category: Categories;
  latitude: number;
  longitude: number;
  categoryTags: string;
  hashTags: string[];
  // region?: Regions;
  openingHours: string[];
  googleMapsUri: string;
  linkedCollections: ILinkCollection[];
  placeImages: IPlaceImage[];
}

export interface ILinkCollection {
  id: number;
  link: string;
  collectionType: number;
  content: string;
  isViewed: boolean;
  updateAt: string;
}

export interface IPlaceImage {
  url: string;
  authorName: string;
  authorUri: string;
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
  default: [],
});

export default placeAtom;
