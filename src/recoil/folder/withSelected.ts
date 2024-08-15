import {selector} from 'recoil';
import folderAtom from './atom';
import {selectedFolderAtom} from './index';

const folderWithSelected = selector({
  key: 'folderWithSelected',
  get: ({get}) => {
    const folders = get(folderAtom);
    const selectedFolderIndex = get(selectedFolderAtom);
    return folders.find(folder => folder.id === selectedFolderIndex);
  },
});

export default folderWithSelected;
