import React from "react";

const Footer = () => {
  return (
    <footer className="app-footer">
      <p className="copyright-text">
        ©️{" "}
        <a
          href="https://discord.com/users/YOUR_DISCORD_ID"
          target="_blank"
          rel="noopener noreferrer"
          className="discord-link"
        >
          @thecing
        </a>{" "}
        2025. From the creator of{" "}
        <a
          href="https://isthebidenatordead.co"
          target="_blank"
          rel="noopener noreferrer"
        >
          isthebidenatordead.co
        </a>
      </p>
    </footer>
  );
};

export default Footer;
