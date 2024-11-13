const responseFormatter = (success, message, data = null) => {
    return {
      success,
      message,
      data
    };
  };
  
  module.exports = responseFormatter;