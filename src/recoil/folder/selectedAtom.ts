import {atom} from 'recoil';

const selectedFolderAtom = atom<number | null>({
  key: 'selectedFolderAtom',
  default: null,
});

export default selectedFolderAtom;
