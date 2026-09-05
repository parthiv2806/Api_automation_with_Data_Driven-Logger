export const partialUpdateBookingFlexibleSchema = {
  type: "object",
  additionalProperties: false,
  // Minimum 1 property ka hona zaroori hai update ke liye
  minProperties: 1, 

  properties: {
    firstname: {
      type: "string",
      minLength: 1
    },

    lastname: {
      type: "string",
      minLength: 1
    },

    totalprice: {
      type: "integer",
      minimum: 0
    },

    depositpaid: {
      type: "boolean"
    },

    bookingdates: {
      type: "object",
      additionalProperties: false,
      properties: {
        checkin: {
          type: "string",
          pattern: "^\\d{4}-\\d{2}-\\d{2}$"
        },
        checkout: {
          type: "string",
          pattern: "^\\d{4}-\\d{2}-\\d{2}$"
        }
      }
    },

    additionalneeds: {
      type: "string"
    }
  }
};

// export const partialUpdateBookingJsonErrorSchema = {
//   type: "object",
//   additionalProperties: false,
//   required: ["status", "message"],

//   properties: {
//     status: {
//       type: "integer",
//       enum: [400, 401, 403, 404]
//     },

//     message: {
//       type: "string",
//       minLength: 1
//     },

//     details: {
//       type: "array",
//       items: {
//         type: "string"
//       }
//     }
//   }
// };