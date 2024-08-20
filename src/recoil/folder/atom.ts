import {atom} from 'recoil';

export interface IFolder {
  id: number;
  title: string;
  imageUrl: string;
  totalCount: number;
}

const folderAtom = atom<IFolder[]>({
  key: 'folderAtom',
  default: [
    {
      id: 1,
      title: 'Instagram',
      imageUrl: '../assets/test-place.png',
      totalCount: 38,
    },
    {
      id: 2,
      title: 'Instagram',
      imageUrl: '../assets/test-place.png',
      totalCount: 38,
    },
    {
      id: 3,
      title: 'Instagram',
      imageUrl: '../assets/test-place.png',
      totalCount: 38,
    },
  ],
});
export default folderAtom;
