SELECT DISTINCT ON (LEAST("senderId", "receiverId"), GREATEST("senderId", "receiverId"))
  m."id", m."text", m."time",
  CASE
    WHEN m."senderId" = $1 THEN m."receiverId"
    ELSE m."senderId"
  END AS "otherUserId",
  u."name", u."role", u."avatar"
FROM "Message" m
JOIN "User" u ON u."id" = CASE
  WHEN m."senderId" = $1 THEN m."receiverId"
  ELSE m."senderId"
END
WHERE m."senderId" = $1 OR m."receiverId" = $1
ORDER BY LEAST(m."senderId", m."receiverId"), GREATEST(m."senderId", m."receiverId"), m."time" DESC
