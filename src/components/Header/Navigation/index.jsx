// Navigation.js
import React from 'react';
import Button from '@mui/material/Button';
import { NavLink } from 'react-router-dom';
import './style.css';

const Navigation = () => {
  const tabLinkClass = ({ isActive }) => (
    `link transition font-semibold text-glowalchemy-charcoal hover:text-glowalchemy-terracotta text-xs sm:text-sm py-2 px-2 sm:px-3 rounded-lg hover:bg-glowalchemy-ivory whitespace-nowrap ` +
    (isActive ? 'text-glowalchemy-terracotta border-b-2 border-glowalchemy-terracotta rounded-b-none' : 'border-b-2 border-transparent')
  );

  return (
    <>
      <nav className='py-3'>
        <div className='flex items-center justify-between'>

          {/* Middle: Main Menu */}
          <div className='col_2 flex-1 px-4 sm:px-8'>
            <ul className='flex items-center justify-center gap-4 sm:gap-8'>
              {/* Home */}
              <li className='list-none relative group'>
                <NavLink to="/" className={tabLinkClass}>
                  Home
                </NavLink>
              </li>

              {/* Services with Dropdown */}
              <li className='list-none relative group'>
                <NavLink to="/services" className={tabLinkClass}>
                  Services
                </NavLink>
                <div className='submenu absolute top-[100%] left-0 min-w-[280px] bg-glowalchemy-white shadow-xl border border-glowalchemy-sand opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 rounded-xl overflow-hidden z-[60]'>
                  <ul>
                    <li>
                      <NavLink to="/services/private-labeling">
                        <Button className='!w-full !text-left !text-glowalchemy-charcoal hover:!bg-glowalchemy-ivory hover:!text-glowalchemy-terracotta transition-colors'>
                          Private Labeling
                        </Button>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/services/third-party-manufacturing">
                        <Button className='!w-full !text-left !text-glowalchemy-charcoal hover:!bg-glowalchemy-ivory hover:!text-glowalchemy-terracotta transition-colors'>
                          Third-Party Cosmetic Manufacturing
                        </Button>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/services/contract-manufacturing">
                        <Button className='!w-full !text-left !text-glowalchemy-charcoal hover:!bg-glowalchemy-ivory hover:!text-glowalchemy-terracotta transition-colors'>
                          Contract Manufacturing
                        </Button>
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </li>

              {/* Products */}
              <li className='list-none relative group'>
                <NavLink to="/ProductListing" className={tabLinkClass}>
                  Products
                </NavLink>
              </li>

              {/* Company with Dropdown */}
              <li className='list-none relative group'>
                <NavLink to="/about" className={tabLinkClass}>
                  Company
                </NavLink>
                <div className='submenu absolute top-[100%] left-0 min-w-[220px] bg-glowalchemy-white shadow-xl border border-glowalchemy-sand opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 rounded-xl overflow-hidden z-[60]'>
                  <ul>
                    <li>
                      <NavLink to="/about">
                        <Button className='!w-full !text-left !text-glowalchemy-charcoal hover:!bg-glowalchemy-ivory hover:!text-glowalchemy-terracotta transition-colors'>
                          About Us
                        </Button>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/company-profile">
                        <Button className='!w-full !text-left !text-glowalchemy-charcoal hover:!bg-glowalchemy-ivory hover:!text-glowalchemy-terracotta transition-colors'>
                          Company Profile
                        </Button>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/manufacturing-capabilities">
                        <Button className='!w-full !text-left !text-glowalchemy-charcoal hover:!bg-glowalchemy-ivory hover:!text-glowalchemy-terracotta transition-colors'>
                          Manufacturing Capabilities
                        </Button>
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </li>

              {/* Contact Us */}
              <li className='list-none relative group'>
                <NavLink to="/contact" className={tabLinkClass}>
                  Contact Us
                </NavLink>
              </li>

              {/* Blog */}
              <li className='list-none relative group'>
                <NavLink to="/blog" className={tabLinkClass}>
                  Blog
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Right: CALL NOW Button */}
          <div className='col_3 flex-shrink-0 flex items-center gap-2 sm:gap-4'>
            <a
              href="tel:+917359230538"
              className="bg-glowalchemy-terracotta text-white px-4 py-2 rounded-lg font-semibold hover:bg-glowalchemy-charcoal transition-colors text-xs sm:text-sm whitespace-nowrap"
            >
              CALL NOW
            </a>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
