import {atom} from 'recoil';

export interface IFolder {
  id: number;
  title: string;
  imageUrl: string;
  totalCount: number;
}

const folderAtom = atom<IFolder[]>({
  key: 'folderAtom',
  default: [],
});
export default folderAtom;
