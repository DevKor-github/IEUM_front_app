export type RootStackParamList = {
  Login: undefined;
  ServiceAgreement: undefined;
  ProfileSetting: undefined;
  PreferenceStart: undefined;
  PreferenceMBTI: undefined;
  PreferenceArea: undefined;
  PreferenceStyle: undefined;
  PreferencePeople: undefined;
  PreferenceDone: undefined;
  InstagramConnect: undefined;
  InstagramFail: undefined;
  SignUpDone: undefined;
  Home: undefined;
};

export type MapStackParamList = {
  Map: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  ServiceAgreement: undefined;
  ProfileEdit: undefined;
  LinkInput: undefined;
  LinkReject: undefined;
  SpotCandidate: undefined;
  SpotSave: {
    collectionId: number;
    collectionContent: string;
    collectionType: string;
  };
  FolderList: {newFolder: string | null};
  NewFolder: undefined;
  FolderPlaceList: {folderId: number; folderName: string};
  RenameFolder: {folderId: number};
  PlaceList: undefined;
};

export type TravelStackParamList = {
  Travel: undefined;
};

export type TabParamList = {
  HomeTab: undefined;
  LinkInput: undefined;
  LinkReject: undefined;
  SpotCandidate: undefined;
  MapTab: undefined;
  TravelTab: undefined;
};
