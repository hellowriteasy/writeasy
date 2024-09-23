// import { StatusCodes } from "http-status-codes";
const { StatusCodes } = require("http-status-codes");

function withErrorResponse(error, req, res) {
  console.log(error.type, error);
  if (error.type === "client") {
    return {
      status: error.status ?? StatusCodes.BAD_REQUEST,
      body: {
        message: error.data.message,
      },
    };
  } else {
    // req.logger.error(
    //   {
    //     method: req.method,
    //     url: req.url,
    //     requestId: req.requestId,
    //     error: {
    //       message: error.data.message,
    //       stack: error.data.stack,
    //     },
    //     body: req?.body,
    //     query: req?.query,
    //     params: req.params,
    //   },
    //   `Internal Server Error: ${error.data.message}`
    // );

    return res.status(error.status ?? StatusCodes.INTERNAL_SERVER_ERROR).json({
      body: {
        message: "Internal Server Error",
      },
    });
  }
}
module.exports = {
  withErrorResponse,
};
