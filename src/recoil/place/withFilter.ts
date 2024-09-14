import {selector} from 'recoil';
import placeAtom from './atom';
import categoryAtom from '../category';
import regionAtom from '../region';
import {Regions} from '../region/atom';

const placeWithFilter = selector({
  // todo 제거
  key: 'placeWithFilter',
  get: ({get}) => {
    const places = get(placeAtom);
    const categories = get(categoryAtom);
    const regions = get(regionAtom);

    let filteredPlace = places;

    // if (categories.length > 0) {
    //   filteredPlace = filteredPlace.filter(place =>
    //     categories.includes(place.category),
    //   );
    // }
    //
    // if (regions.length > 0) {
    //   filteredPlace = filteredPlace.filter(place =>
    //     regions.includes(place.region || Regions.SEOUL),
    //   );
    // }

    return filteredPlace;
  },
});

export default placeWithFilter;
