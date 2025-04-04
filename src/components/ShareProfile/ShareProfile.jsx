import React from "react";
import { Send } from "lucide-react";
import "./ShareProfile.css";

const ShareProfile = ({fontsize,profileurllink}) => {
  const profileLink = window.location.href; // Get the current page URL

  const handleShare = async () => {
    try {
      // Copy the link to clipboard
      await navigator.clipboard.writeText(profileLink);
      

      // Open the native share options (if supported)
      if (navigator.share) {
        await navigator.share({
          title: "Check out this profile!",
          text: "Here's a profile you might like:",
          url:profileurllink ? profileurllink : profileLink,
        });
      } else {
        alert("Sharing options are not supported in this browser.");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <button className="share-btn iconbtn active" onClick={handleShare}>
        <Send  size={fontsize ? fontsize : 18} />
    </button>
  );
};

export default ShareProfile;
