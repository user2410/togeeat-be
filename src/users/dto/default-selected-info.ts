export const defaultSelectedUserInfo = {
	id: true,
	name: true,
	avatar: true,
  hobbies: {
    include: {
      hobby: {
        select: {
          name: true,
        }
      }
    }
  }
};