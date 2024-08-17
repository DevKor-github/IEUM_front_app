import {selector} from 'recoil';
import placeAtom from './atom';
import {folderWithSelected} from '../folder';

const placeWithFolder = selector({
  key: 'placeWithFolder',
  get: ({get}) => {
    const places = get(placeAtom);
    const selectedFolder = get(folderWithSelected);
    if (!selectedFolder) return []; // todo
    return places;
    // return places.filter(place => selectedFolder.includes(place.category));
  },
});

export default placeWithFolder;
