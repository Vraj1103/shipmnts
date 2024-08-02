export const sendToken = (user, statusCode, res, message) => {
  const token = user.getJwtToken();
  const options = {
    expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "none",
    secure: true,
  };
  const resPayload = {
    success: true,
    token: token,
    user,
    message,
  };
  res.status(statusCode).cookie("token", token, options).json(resPayload);
};
