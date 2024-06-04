const jwt = require('jsonwebtoken'); // Ensure jsonwebtoken is installed
const cookieParser = require('cookie-parser'); // Ensure cookie-parser is installed

// Function to generate JWT token
const generateToken = (user, message, statusCode, res) => {
  // Generate the JWT token using a method from the user object
  const token = user.generateJsonWebToken();
  
  // Determine the cookie name based on the user role
  const cookieName = user.role === 'Admin' ? 'adminToken' : 'patientToken';

  // Set cookie options
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Ensure cookies are only sent over HTTPS in production
    sameSite: 'None' // Set to 'None' for cross-site requests, can also be 'Strict' or 'Lax' depending on your requirements
  };

  // Send the response with the token set in an HTTP-only cookie
  res
    .status(statusCode)
    .cookie(cookieName, token, cookieOptions)
    .json({
      success: true,
      message,
      user,
      token,
    });
};

module.exports = generateToken;
