import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#191C27] text-white py-6 shadow-t-sm">
      <div className="container mx-auto text-center">
        {/* Navigation Links */}
        <nav className="mb-4">
          <Link href="/" className="mx-3 hover:text-yellow-500">
            Home
          </Link>
          <Link href="/privacy-policy" className="mx-3 hover:text-yellow-500">
           Privcy Policy
          </Link>
          <Link
            href="/terms-of-use"
            className="mx-3 hover:text-yellow-500"
          >
           Terms of use
          </Link>
          <Link
            href="/about-us"
            className="mx-3 hover:text-yellow-500"
          >
            About Us
          </Link>
          <Link href="/contact" className="mx-3 hover:text-yellow-500">
            Contact
          </Link>
          <Link href="/blog" className="mx-3 hover:text-yellow-500">
            Blog
          </Link>
        </nav>

        {/* Copyright Section */}
        <p className="text-sm mb-4">
         © 2025 Gentle Moving Inc. All rights reserved
        </p>

        {/* Social Media Icons */}
        <div className="flex justify-center space-x-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-gray-200 text-gray-600 flex items-center justify-center rounded-full hover:bg-gray-300 transition"
          >
            <Facebook className="w-6 h-6" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-gray-200 text-gray-600 flex items-center justify-center rounded-full hover:bg-gray-300 transition"
          >
            <Instagram className="w-6 h-6" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-gray-200 text-gray-600 flex items-center justify-center rounded-full hover:bg-gray-300 transition"
          >
            <Twitter className="w-6 h-6" />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-gray-200 text-gray-600 flex items-center justify-center rounded-full hover:bg-gray-300 transition"
          >
            <Youtube className="w-6 h-6" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
