export default function (req, res, next) {
  const { email, firstName, lastName, password } = req.body;

  function validEmail(userEmail) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
  }

  if (req.originalUrl === "/api/user/signup") {
    if (![email, firstName, lastName, password].every(Boolean)) {
      return res.status(401).json({ message: "Missing Credentials" });
    } else if (!validEmail(email)) {
      return res.status(401).json({ message: "Invalid Email" });
    }
  } else if (req.originalUrl === "/api/user/login") {
    if (![email, password].every(Boolean)) {
      return res.status(401).json({ message: "Missing Credentials" });
    } else if (!validEmail(email)) {
      return res.status(401).json({ message: "Invalid Email" });
    }
  }

  next();
}