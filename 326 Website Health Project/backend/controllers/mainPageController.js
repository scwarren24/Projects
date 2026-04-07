import SQLiteProfileModel from "../models/Profile.js";

async function getProfile(req, res) {
  try {
    const profile = await SQLiteProfileModel.read();
    if (!profile) {
      return res.status(404).json({ message: "No profile found" });
    }
    res.json(profile);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function saveProfile(req, res) {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    await SQLiteProfileModel.createOrUpdate({ name, email });
    res.json({ message: "Profile saved" });
  } catch (err) {
    console.error("Error saving profile:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function deleteProfile(req, res) {
  try {
    await SQLiteProfileModel.delete();
    res.json({ message: "Profile deleted" });
  } catch (err) {
    console.error("Error deleting profile:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export { getProfile, saveProfile, deleteProfile };
