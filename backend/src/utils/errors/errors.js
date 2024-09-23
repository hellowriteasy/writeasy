class InternalServerError extends Error {
  constructor(message, stack) {
    super(message);
    this.name = "INTERNAL_SERVER_ERROR";
    this.message = message;
    this.stack = stack;
    Error.captureStackTrace(this, InternalServerError);
  }
}

class ClientError extends Error {
  constructor(message) {
    super(message);
    this.name = "CLIENT_ERROR";
    this.message = message;
    Error.captureStackTrace(this, ClientError);
  }
}

class FinanceError extends Error {
  constructor(message) {
    super(message);
    this.name === "FINANCE_ERROR";
    this.message = message;
    Error.captureStackTrace(this, FinanceError);
  }
}

module.exports = {
  InternalServerError,
  ClientError,
  FinanceError,
};
