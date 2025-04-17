"use strict";

const sendProfileData = (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};

const sendProtectedData = (req, res) => {
  res
    .status(200)
    .json({ success: true, message: "May the force be with you!" });
};

export { sendProfileData, sendProtectedData };
