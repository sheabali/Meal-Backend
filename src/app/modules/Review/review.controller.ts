import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ReviewService } from './review.service';

const createReview = catchAsync(async (req, res) => {
  const result = await ReviewService.createReview(req.body);
  sendResponse(res, {
    success: true,
    message: 'Review submitted successfully',
    statusCode: 201,
    data: result,
  });
});

export const ReviewController = {
  createReview,
};
