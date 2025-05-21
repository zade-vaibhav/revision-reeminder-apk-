const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashed,
      authProvider: "local",
    });

    res.status(201).json({
      _id: user._id,
      email: user.email,
      username: user.username,
      authProvider: user.authProvider,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.authProvider !== "local") {
      return res.status(400).json({
        message: `Please login using ${user.authProvider} authentication method`,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      _id: user._id,
      email: user.email,
      username: user.username,
      authProvider: user.authProvider,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


async function verifyGoogleAccessToken(accessToken) {
  const response = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`);
  if (!response.ok) {
    throw new Error("Invalid access token");
  }
  const tokenInfo = await response.json();
  return tokenInfo; // includes email, scope, expiry, etc.
}

async function fetchGoogleUserProfile(accessToken) {
  const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch user profile");
  }
  return response.json(); // contains id, email, name, picture, etc.
}

exports.googleLogin = async (req, res) => {
  const { accessToken } = req.body;

  if (!accessToken) {
    return res.status(400).json({ message: "Access token missing" });
  }

  try {
    // Fetch user profile from Google
    // Fetch user profile from Google API
    const profile = await fetchGoogleUserProfile(accessToken);
    console.log("User profile:", profile);

    if (!profile.email) {
      return res.status(400).json({ message: "Google profile missing email" });
    }

    // Find existing user by email
    let user = await User.findOne({ email: profile.email });

    if (user) {
      if (user.authProvider !== "google") {
        return res.status(400).json({
          message: "Please login using email and password",
        });
      }
    } else {
      // Create new Google user
      user = await User.create({
        username: profile.name,
        email: profile.email,
        email_verified:profile.email_verified,
        authProvider: "google",
        password: accessToken, // placeholder; not used for login
      });
    }

    // Return JWT token
    res.json({
      _id: user._id,
      email: user.email,
      username: user.username,
      authProvider: user.authProvider,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(401).json({ message: "Google authentication failed" });
  }
};

exports.googleRegister = async (req, res) => {
  const { accessToken } = req.body;

  if (!accessToken) {
    return res.status(400).json({ message: "Access token missing" });
  }

  try {
    // Verify Google access token validity
    const tokenInfo = await verifyGoogleAccessToken(accessToken);
    console.log("Token info:", tokenInfo);

    // Fetch user profile from Google API
    const profile = await fetchGoogleUserProfile(accessToken);
    console.log("User profile:", profile);

    if (!profile.email) {
      return res.status(400).json({ message: "Unable to retrieve email from Google profile" });
    }

    // Check if user with this email already exists
    let user = await User.findOne({ email: profile.email });

    if (user) {
      // User exists but registered locally
      if (user.authProvider !== "google") {
        return res.status(400).json({
          message: "Email already registered via manual signup. Please login using email and password.",
        });
      }

      // User already registered with Google, just return token
      const token = generateToken(user._id);
      return res.json({
        token,
        user: { email: user.email, username: user.username, authProvider: user.authProvider },
      });
    }

    // New user, create with Google auth provider
    user = await User.create({
      username: profile.name,
      email: profile.email,
      email_verified:profile.email_verified,
      password: accessToken, // placeholder, not used for login
      authProvider: "google",
    });

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: { email: user.email, username: user.username, authProvider: user.authProvider },
    });
  } catch (error) {
    console.error("Google register error:", error);
    res.status(401).json({ message: "Invalid Google token" });
  }
};
