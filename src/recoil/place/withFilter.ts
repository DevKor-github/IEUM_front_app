import {selector} from 'recoil';
import placeAtom from './atom';
import categoryAtom from '../category';

const placeWithFilter = selector({
  key: 'placeWithFilter',
  get: ({get}) => {
    const places = get(placeAtom);
    const categories = get(categoryAtom);
    if (categories.length === 0) return places;
    return places.filter(place => categories.includes(place.category));
  },
});

export default placeWithFilter;
