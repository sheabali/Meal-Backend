import { TStudent } from './user.interface';

const createUserIntoDB = async (password: string, studentData: TStudent) => {
  console.log('hit create user route');
};

export const UserServices = {
  createUserIntoDB,
  // createFacultyIntoDB,
  // createAdminIntoDB,
};
