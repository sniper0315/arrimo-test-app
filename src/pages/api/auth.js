import jwt from "jsonwebtoken";

export default function handler(req, res) {
  if (req.method === "POST") {
    const user = {
      username: req.body.username,
      status: "got it",
    };
    const token = jwt.sign(
      {
        user: user,
      },
      "soccerscouting4u-secret-key",
      { expiresIn: "12h" }
    );

    return res.json(token);
  }

  return res.status(401).json("Invalid Request");
}
