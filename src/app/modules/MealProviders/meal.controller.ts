import catchAsync from '../../utils/catchAsync';

const createMeal = catchAsync(async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Meal created successfully',
  });
});

export const MealController = { createMeal };
