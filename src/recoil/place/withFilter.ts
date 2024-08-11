import {selector} from 'recoil';
import placeAtom from './atom';
import categoryAtom from '../category';

const placeWithFilter = selector({
  key: 'placeWithFilter',
  get: ({get}) => {
    const toDos = get(placeAtom);
    const category = get(categoryAtom);

    return toDos.filter(todo => todo.category === category);
  },
});

export default placeWithFilter;
