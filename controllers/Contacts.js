require("dotenv").config();
const User = require("../models/User");
const Contact = require("../models/Contact");
const Number=require("../models/Number")


exports.syncContacts = async (req, res) => {
  try {
    const userId = req.user.id;
    const contacts = req.body.contacts;

    if (!Array.isArray(contacts) || contacts.length === 0) {
      return res.status(400).json({
        message: "Contacts must be a non-empty array",
      });
    }

    // Clear previous contacts
    await Contact.deleteMany({ user: userId });

    const contactDocs = await Promise.all(
      contacts.map(async (contact) => {
        const phoneStr = contact.phone;

        // Step 1: Find or create Number document
        let numberDoc = await Number.findOne({ number: phoneStr });
        if (!numberDoc) {
          numberDoc = await Number.create({ number: phoneStr });
        }

        // Step 2: Check if this number is used by a User
        const existingUser = await User.findOne({ phoneNumber: numberDoc._id });

        // Step 3: Build the contact document
        return {
          user: userId,
          name: contact.name,
          phone: numberDoc._id,
          isAppUser: !!existingUser,
        };
      })
    );

    // Insert all contacts
    await Contact.insertMany(contactDocs);

    // Update last sync timestamp
    await User.findByIdAndUpdate(userId, {
      lastContactSync: new Date(),
    });

    return res.status(200).json({
      message: "Contacts synced successfully",
      total: contactDocs.length,
    });
  } catch (error) {
    console.error("Error syncing contacts:", error);
    return res.status(500).json({
      message: "Something went wrong while syncing contacts",
      error: error.message,
    });
  }
};

exports.getAllContacts=async(req,res)=>{
  try {
    const userId=req.user.id;  // ID of the logged-in user

    const allContactsOfUSer=await Contact.find({user:userId}).select("name phone").populate({path:"phone",
      select:"number"
    });
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
