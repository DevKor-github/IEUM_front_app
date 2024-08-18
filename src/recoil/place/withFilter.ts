import {selector} from 'recoil';
import placeAtom from './atom';
import categoryAtom from '../category';
import {Categories} from '../category/atom';

const placeWithFilter = selector({
  key: 'placeWithFilter',
  get: ({get}) => {
    const places = get(placeAtom);
    const category = get(categoryAtom);

    if (category === Categories.DEFAULT) return places;

    return places.filter(place => place.category === category);
  },
});

export default placeWithFilter;
