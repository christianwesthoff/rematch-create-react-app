export const getUsers = () => {
      return {
        url: `https://localhost:5001/api/user`,
        transform: (response: any, headers: any) => {
          return {};
        }
    }
  };