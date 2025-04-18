"use strict";

const handleMicrosoftCallback = async (req, res) => {
  const { jwt: token } = req.user;

  res
    .cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    })
    .redirect(req.headers.referer || process.env.FRONTEND_REDIRECTION_URL);
};

const sendAuthStatus = (req, res) => {
  const user = req.user;
  res.status(200).json({ success: true, user });
};

const signOutUser = (req, res) => {
  res
    .clearCookie("token")
    .status(200)
    .json({ success: true, message: "Logged out user" });
};

export { handleMicrosoftCallback, sendAuthStatus, signOutUser };
