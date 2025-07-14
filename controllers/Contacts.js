require("dotenv").config();
const User = require("../models/User");
const Contact = require("../models/Contact");


exports.syncContacts = async (req, res) => {
  try {
    const userId = req.user.id; // ID of the logged-in user
    const contacts = req.body.contacts; // JSON contacts array from frontend

    // Validate input
    if (!Array.isArray(contacts) || contacts.length === 0) {
      return res
        .status(400)
        .json({ message: "Contacts must be a non-empty array" });
    }

    await Contact.deleteMany({ user: userId });

    const contactDocs = await Promise.all(
      contacts.map(async (contact) => {
        const existingUser = await User.findOne({ phoneNumber: contact.phone });

        return {
          user: userId,
          name: contact.name,
          phone: contact.phone,
          isAppUser: !!existingUser,
        };
      })
    );

    await Contact.insertMany(contactDocs);
    await User.findByIdAndUpdate(userId, {
  lastContactSync: new Date()
});

    res.status(200).json({
      message: "Contacts synced successfully",
      total: contactDocs.length,
    });
  } catch (error) {
    console.error("Error syncing contacts:", error);
    res.status(500).json({
      message: "Something went wrong while syncing contacts",
      error: error.message,
    });
  }
};
exports.getAllContacts=async(req,res)=>{
  try {
    const userId=req.user.id;  // ID of the logged-in user

    const allContactsOfUSer=await Contact.find({user:userId}).select("name phone");
    return res.status(200).json({
      success:true,
      allContactsOfUSer,
    })
    
  } catch (error) {
    console.error("Error inFetching Contacts:", error);
    res.status(500).json({
      message: "Something went wrong while Fetching contacts",
      error: error.message,
    });
  }
}
