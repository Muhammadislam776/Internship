const { supabase, BUCKET_NAME } = require('../config/supabase');
const { generateUniqueFilename, validateFileType } = require('../utils/fileUtils');

// Default fallback avatar
const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80';

// In-memory profile storage state (for demo user)
let userProfile = {
  id: 'user-1',
  name: 'Alex Rivera',
  email: 'alex.rivera@profilehub.io',
  jobTitle: 'Senior Product Designer',
  role: 'Administrator',
  phone: '+1 (555) 234-5678',
  location: 'San Francisco, CA',
  bio: 'Passionate about crafting fluid user interfaces, design systems, and secure full-stack cloud applications.',
  website: 'https://alexrivera.design',
  socialLinks: {
    github: 'https://github.com',
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com'
  },
  avatar_url: DEFAULT_AVATAR,
  avatar_path: null,
  memberSince: 'March 2024',
  previousUploads: [
    {
      id: 'img-init-1',
      url: DEFAULT_AVATAR,
      fileName: 'alex-default-portrait.jpg',
      uploadedAt: new Date(Date.now() - 86400000 * 30).toISOString()
    }
  ]
};

/**
 * Calculates current profile completion percentage dynamically
 */
function calculateProfileCompletion(profile) {
  const fields = [
    { key: 'name', weight: 15 },
    { key: 'email', weight: 15 },
    { key: 'jobTitle', weight: 15 },
    { key: 'location', weight: 10 },
    { key: 'bio', weight: 15 },
    { key: 'avatar_url', weight: 20, check: (val) => val && val !== DEFAULT_AVATAR },
    { key: 'phone', weight: 5 },
    { key: 'website', weight: 5 }
  ];

  let completedWeight = 0;
  fields.forEach(f => {
    if (f.check) {
      if (f.check(profile[f.key])) completedWeight += f.weight;
    } else if (profile[f.key] && String(profile[f.key]).trim().length > 0) {
      completedWeight += f.weight;
    }
  });

  return Math.min(100, completedWeight);
}

/**
 * GET /api/profile/:id
 * Retrieve user profile
 */
const getProfile = async (req, res) => {
  try {
    const profileCompletion = calculateProfileCompletion(userProfile);
    return res.status(200).json({
      success: true,
      profile: {
        ...userProfile,
        profileCompletion
      }
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving user profile.'
    });
  }
};

/**
 * PUT /api/profile/:id
 * Update profile basic information
 */
const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, location, bio, jobTitle, website, socialLinks } = req.body;

    if (name !== undefined) userProfile.name = name;
    if (email !== undefined) userProfile.email = email;
    if (phone !== undefined) userProfile.phone = phone;
    if (location !== undefined) userProfile.location = location;
    if (bio !== undefined) userProfile.bio = bio;
    if (jobTitle !== undefined) userProfile.jobTitle = jobTitle;
    if (website !== undefined) userProfile.website = website;
    if (socialLinks !== undefined) {
      userProfile.socialLinks = { ...userProfile.socialLinks, ...socialLinks };
    }

    const updatedCompletion = calculateProfileCompletion(userProfile);

    return res.status(200).json({
      success: true,
      message: 'Profile information updated successfully.',
      profile: {
        ...userProfile,
        profileCompletion: updatedCompletion
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile info.'
    });
  }
};

/**
 * POST /api/profile/upload
 * Securely receive image file, validate, upload to Supabase Storage bucket 'profile-pictures'
 */
const uploadProfilePicture = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided in request.'
      });
    }

    // Double check file validation
    const validation = validateFileType(file);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    // Generate unique storage path
    const userId = userProfile.id;
    const filePath = generateUniqueFilename(userId, file.originalname);

    console.log(`🚀 Uploading image to Supabase Storage bucket '${BUCKET_NAME}' at path: ${filePath}`);

    // Upload file buffer to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true
      });

    if (uploadError) {
      console.error('❌ Supabase storage upload error:', uploadError);
      return res.status(500).json({
        success: false,
        message: `Supabase Storage upload failed: ${uploadError.message}`
      });
    }

    // Get public URL from Supabase Storage
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    const imageUrl = publicUrlData.publicUrl;

    // Archive or update old picture if existed
    const oldPath = userProfile.avatar_path;
    if (oldPath && oldPath !== filePath) {
      try {
        console.log(`🗑️ Removing old image path: ${oldPath}`);
        await supabase.storage.from(BUCKET_NAME).remove([oldPath]);
      } catch (removeErr) {
        console.warn('Warning: Could not remove old image file:', removeErr.message);
      }
    }

    // Update in-memory user profile
    userProfile.avatar_url = imageUrl;
    userProfile.avatar_path = filePath;

    // Add to previous uploads history
    const mediaItem = {
      id: `img-${Date.now()}`,
      url: imageUrl,
      fileName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
      uploadedAt: new Date().toISOString(),
      path: filePath
    };

    // Keep top 6 previous uploads
    userProfile.previousUploads = [mediaItem, ...userProfile.previousUploads].slice(0, 6);

    const profileCompletion = calculateProfileCompletion(userProfile);

    console.log(`✅ Upload successful! Public URL: ${imageUrl}`);

    return res.status(200).json({
      success: true,
      message: 'Profile picture uploaded successfully',
      url: imageUrl,
      path: filePath,
      profile: {
        ...userProfile,
        profileCompletion
      }
    });

  } catch (error) {
    console.error('❌ Unexpected upload controller error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'An unexpected error occurred during upload.'
    });
  }
};

/**
 * DELETE /api/profile/image
 * Remove user profile picture and reset to default avatar
 */
const deleteProfilePicture = async (req, res) => {
  try {
    const currentPath = userProfile.avatar_path;

    if (currentPath) {
      console.log(`🗑️ Deleting profile picture path from Supabase: ${currentPath}`);
      const { error: deleteError } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([currentPath]);

      if (deleteError) {
        console.warn('Warning deleting file from Supabase storage:', deleteError.message);
      }
    }

    userProfile.avatar_url = DEFAULT_AVATAR;
    userProfile.avatar_path = null;

    const profileCompletion = calculateProfileCompletion(userProfile);

    return res.status(200).json({
      success: true,
      message: 'Profile picture removed successfully.',
      defaultUrl: DEFAULT_AVATAR,
      profile: {
        ...userProfile,
        profileCompletion
      }
    });
  } catch (error) {
    console.error('Error deleting profile image:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete profile picture.'
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadProfilePicture,
  deleteProfilePicture
};
