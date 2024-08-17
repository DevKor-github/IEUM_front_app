import { atom } from "recoil";

const userInfoAtom = atom({
    key: 'userInfoAtom',
  default: {
        isAdConfirmed: false,
        nickname: "",
        birthDate: "",
        sex: "",
        mbti: "",
        preferredRegion: [""],
        preferredCompanion: [""],
        budgetStyle: 0,
        planningStyle: 0,
        scheduleStyle: 0,
        destinationStyle1: 0,
        destinationStyle2: 0,
        destinationStyle3: 0
      }
})

export default userInfoAtom;