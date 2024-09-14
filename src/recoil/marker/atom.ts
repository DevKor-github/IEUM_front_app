import {atom} from 'recoil';
import {Categories} from '../category/atom';

export interface IMarker {
  id: number; // Numeric ID for the place
  name: string; // Name of the place
  category: Categories; // Category of the place, e.g., "Restaurant"
  latitude: number; // Latitude as a string
  longitude: number; // Longitude as a string
}

const markerAtom = atom<IMarker[]>({
  key: 'markerAtom',
  default: [],
});

export default markerAtom;
