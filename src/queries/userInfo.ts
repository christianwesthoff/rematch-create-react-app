import { asRecords } from "utils/normalizeUtils";

export interface LoggedUserInfo {
  id: string,
  name: string
}

export const getUserInfo = () => {
      return {
        url: `/connect/userinfo`,
        transform: (response: any, headers: any) => {
          const userInfo = asRecords<string, LoggedUserInfo>(response, t => t.id);
          return {
            userInfo,
          };
        }
    }
  };