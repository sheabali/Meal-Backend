import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const createAddress = catchAsync(async (req, res) => {
  const result = await AddressService.createAddress(req.body, req.user);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Address added successfully',
    data: result,
  });
});

const updateAddress = catchAsync(async (req, res) => {
  const result = await AddressService.updateAddress(req.body, req.user);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Address updated successfully',
    data: result,
  });
});

const getMyAddress = catchAsync(async (req, res) => {
  const result = await AddressService.getMyAddress(req.user);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Address retrieved successfully',
    data: result,
  });
});

export const AddressController = {
  createAddress,
  updateAddress,
  getMyAddress,
};
