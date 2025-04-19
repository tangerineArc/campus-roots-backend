"use strict";

export default function decideUserRole(email) {
  const currentYear = new Date().getFullYear();
  let admissionYear;

  const cleanedEmail = email.split("@")[0];
  const chunks = cleanedEmail.split("_");

  if (chunks.length > 1) {
    const [part1, part2] = chunks;
    if (/\d/.test(part1)) {
      admissionYear = part1.slice(0, 2);
    } else {
      admissionYear = part2.slice(0, 2);
    }
  } else {
    admissionYear = cleanedEmail.slice(-2);
  }

  admissionYear = Number("20" + admissionYear);

  if (admissionYear < 2008 && admissionYear > currentYear) {
    throw new Error("Not eligible for registration");
  }

  if (currentYear - admissionYear > 4) {
    return "ALUMNUS";
  }
  return "STUDENT";
}
