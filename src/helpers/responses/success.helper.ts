import { HttpStatus } from '@nestjs/common';

// export const sucessResponse = {
//   CREATED: {
//     message: "Inserted successfully.",
//     statusCode: HttpStatus.CREATED,
//   },
//   UPDATED: { message: "Updated successfully.", statusCode: HttpStatus.OK },
//   DELETED: { message: "Deleted successfully.", statusCode: HttpStatus.OK },
//   SUCCESS: {
//     MESSAGE: 'Success',
//     statusCode: HttpStatus.OK
//   }
// };

export function successResponse(
  status: HttpStatus.OK,
  message: string,
  data: any,
) {
  return { status, message, data };
}
