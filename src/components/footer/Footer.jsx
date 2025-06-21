// Libs
// Components, Layouts, Pages
// Others
// Styles, images, icons
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  //#region Declare Hook
  //#endregion Declare Hook

  //#region Selector
  //#endregion Selector

  //#region Declare State
  //#endregion Declare State

  //#region Implement Hook
  //#endregion Implement Hook

  //#region Handle Function
  //#endregion Handle Function

  return (
    <footer className="bg-gray-900 text-gray-200 py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Travel Buddy */}
        <div>
          <h4 className="text-white text-lg font-semibold mb-3">
            Travel Buddy
          </h4>
          <p className="text-sm mb-4">
            Your trusted partner for seamless flight bookings and travel deals
            worldwide.
          </p>
          <p className="text-sm mb-2 font-medium">Follow Us</p>
          <div className="flex space-x-3 text-white text-lg">
            <FaFacebookF className="hover:text-blue-400 cursor-pointer" />
            <FaInstagram className="hover:text-pink-400 cursor-pointer" />
            <FaTwitter className="hover:text-blue-300 cursor-pointer" />
            <FaLinkedinIn className="hover:text-blue-500 cursor-pointer" />
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white text-lg font-semibold mb-3">Quick Links</h4>
          <ul className="text-sm space-y-2">
            <li className="hover:underline cursor-pointer">Flights</li>
            <li className="hover:underline cursor-pointer">Deals</li>
            <li className="hover:underline cursor-pointer">Reservations</li>
            <li className="hover:underline cursor-pointer">About Us</li>
            <li className="hover:underline cursor-pointer">Contact</li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-white text-lg font-semibold mb-3">Support</h4>
          <ul className="text-sm space-y-2">
            <li className="hover:underline cursor-pointer">FAQ</li>
            <li className="hover:underline cursor-pointer">
              Terms & Conditions
            </li>
            <li className="hover:underline cursor-pointer">Privacy Policy</li>
            <li className="hover:underline cursor-pointer">Help Center</li>
            <li className="hover:underline cursor-pointer">Contact Support</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-white text-lg font-semibold mb-3">
            Our Newsletter
          </h4>
          <p className="text-sm mb-3">
            Stay updated with the latest flight deals and travel tips.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-3 py-2 rounded bg-gray-800 text-sm text-white outline-none w-full sm:w-auto"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-500">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
