"use strict";

const handleMicrosoftCallback = async (req, res) => {
  const { jwt: token } = req.user;

  res
    .cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    })
    .redirect(process.env.FRONTEND_REDIRECTION_URL);
};

const sendAuthStatus = (req, res) => {
  const user = req.user;

  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "You are not authenticated" });
  }

  res.status(200).json({ success: true, user });
};

const signOutUser = (req, res) => {
  res
    .clearCookie("token")
    .status(200)
    .json({ success: true, message: "Logged out user" });
};

export { handleMicrosoftCallback, sendAuthStatus, signOutUser };
