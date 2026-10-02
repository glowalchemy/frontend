// Navigation.js
import React, { useMemo } from 'react';
import Button from '@mui/material/Button';
import { NavLink } from 'react-router-dom';
import { useCategories } from '../../../context/CategoryContext';
import './style.css';

const Navigation = () => {
  const { categories } = useCategories();

  const topCategories = useMemo(() => {
    return categories.filter((c) => !c.parentId);
  }, [categories]);

  const childrenByParent = useMemo(() => {
    const map = new Map();
    categories.forEach((c) => {
      if (!c || !c.parentId) return;
      const parentKey = c.parentId && typeof c.parentId === 'object'
        ? (c.parentId.id || c.parentId._id)
        : c.parentId;
      const key = String(parentKey);
      const prev = map.get(key) || [];
      prev.push(c);
      map.set(key, prev);
    });
    return map;
  }, [categories]);

  const menuItems = [
    'Home',
    'Fashion',
    'Jewellery'
  ];

  const routeForMenuItem = (item) => {
    const label = String(item);
    if (label === 'Home') return '/';
    if (label === 'Grossary') return `/ProductListing?category=${encodeURIComponent('Grocery')}`;
    if (label === 'Jewellery') return `/ProductListing?category=${encodeURIComponent('Jewellery')}`;
    return `/ProductListing?category=${encodeURIComponent(label)}`;
  };

  const routeForCategory = (value) => `/ProductListing?category=${encodeURIComponent(String(value))}`;
  const routeForSubCategory = (parentName, childId) => {
    const parent = String(parentName || '').trim();
    const child = String(childId || '').trim();
    const params = new URLSearchParams();
    if (parent) params.set('category', parent);
    if (child) params.set('subCategoryId', child);
    return `/ProductListing?${params.toString()}`;
  };

  const tabLinkClass = ({ isActive }) => (
    `link transition font-semibold text-trozzi-charcoal hover:text-trozzi-terracotta text-xs sm:text-sm py-2 px-2 sm:px-3 rounded-lg hover:bg-trozzi-ivory whitespace-nowrap ` +
    (isActive ? 'text-trozzi-terracotta border-b-2 border-trozzi-terracotta rounded-b-none' : 'border-b-2 border-transparent')
  );

  return (
    <>
      <nav className='py-3'>
        <div className='flex items-center justify-between'>

          {/* Middle: Main Menu */}
          <div className='col_2 flex-1 px-4 sm:px-8'>
            <ul className='flex items-center justify-center gap-4 sm:gap-8'>
              {topCategories.length > 0 ? (
                <>
                  <li key="Home" className='list-none relative group'>
                    <NavLink to="/" className={tabLinkClass}>
                      Home
                    </NavLink>
                  </li>
                  {topCategories.map((cat) => {
                    const catKey = String(cat.id || cat._id || cat.name);
                    const children = childrenByParent.get(catKey) || [];
                    return (
                      <li key={catKey} className='list-none relative group'>
                        <NavLink to={routeForCategory(cat.id || cat._id || cat.name)} className={tabLinkClass}>
                          {cat.name}
                        </NavLink>

                        {children.length > 0 && (
                          <div className='submenu absolute top-[100%] left-0 min-w-[220px] bg-trozzi-white shadow-xl border border-trozzi-sand opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 rounded-xl overflow-hidden z-50'>
                            <ul>
                              {children.map((child) => (
                                <li key={child.id || child.name}>
                                  <NavLink to={routeForSubCategory(cat.name, child.id || child._id)}>
                                    <Button className='!w-full !text-left !text-trozzi-charcoal hover:!bg-trozzi-ivory hover:!text-trozzi-terracotta transition-colors'>
                                      {child.name}
                                    </Button>
                                  </NavLink>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </>
              ) : (
                menuItems.map((item) => (
                  <li key={item} className='list-none relative group'>
                    <NavLink to={routeForMenuItem(item)} className={tabLinkClass}>
                      {item}
                    </NavLink>

                    {/* Fashion -> Submenu */}
                    {item === 'Fashion' && (
                      <div className='submenu absolute top-[100%] left-0 min-w-[220px] bg-trozzi-white shadow-xl border border-trozzi-sand opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 rounded-xl overflow-hidden z-50'>
                        <ul>
                          {/* Women */}
                          <li className='list-none relative group/sub'>
                            <NavLink to={routeForMenuItem('Fashion')}><Button className='!w-full !text-left !text-trozzi-charcoal hover:!bg-trozzi-ivory hover:!text-trozzi-terracotta transition-colors'>Women</Button></NavLink>
                            <div className='submenu absolute top-0 left-[100%] min-w-[200px] bg-trozzi-white shadow-xl border border-trozzi-sand opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-200 rounded-xl overflow-hidden z-50'>
                              <ul>
                                <li><NavLink to={routeForMenuItem('Fashion')}><Button className='!w-full !text-left !text-trozzi-charcoal hover:!bg-trozzi-ivory hover:!text-trozzi-terracotta transition-colors'>Dresses</Button></NavLink></li>
                                <li><NavLink to={routeForMenuItem('Fashion')}><Button className='!w-full !text-left !text-trozzi-charcoal hover:!bg-trozzi-ivory hover:!text-trozzi-terracotta transition-colors'>Shoes</Button></NavLink></li>
                                <li><NavLink to={routeForMenuItem('Fashion')}><Button className='!w-full !text-left !text-trozzi-charcoal hover:!bg-trozzi-ivory hover:!text-trozzi-terracotta transition-colors'>Bags</Button></NavLink></li>
                              </ul>
                            </div>
                          </li>

                          {/* Men */}
                          <li className='list-none relative group/sub'>
                            <NavLink to={routeForMenuItem('Fashion')}><Button className='!w-full !text-left !text-trozzi-charcoal hover:!bg-trozzi-ivory hover:!text-trozzi-terracotta transition-colors'>Men</Button></NavLink>
                            <div className='submenu absolute top-0 left-[100%] min-w-[200px] bg-trozzi-white shadow-xl border border-trozzi-sand opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-200 rounded-xl overflow-hidden z-50'>
                              <ul>
                                <li><NavLink to={routeForMenuItem('Fashion')}><Button className='!w-full !text-left !text-trozzi-charcoal hover:!bg-trozzi-ivory hover:!text-trozzi-terracotta transition-colors'>Shirts</Button></NavLink></li>
                                <li><NavLink to={routeForMenuItem('Fashion')}><Button className='!w-full !text-left !text-trozzi-charcoal hover:!bg-trozzi-ivory hover:!text-trozzi-terracotta transition-colors'>Watches</Button></NavLink></li>
                                <li><NavLink to={routeForMenuItem('Fashion')}><Button className='!w-full !text-left !text-trozzi-charcoal hover:!bg-trozzi-ivory hover:!text-trozzi-terracotta transition-colors'>Jackets</Button></NavLink></li>
                              </ul>
                            </div>
                          </li>

                          {/* Girls */}
                          <li className='list-none relative group/sub'>
                            <NavLink to={routeForMenuItem('Fashion')}><Button className='!w-full !text-left !text-trozzi-charcoal hover:!bg-trozzi-ivory hover:!text-trozzi-terracotta transition-colors'>Girls</Button></NavLink>
                            <div className='submenu absolute top-0 left-[100%] min-w-[200px] bg-trozzi-white shadow-xl border border-trozzi-sand opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-200 rounded-xl overflow-hidden z-50'>
                              <ul>
                                <li><NavLink to={routeForMenuItem('Fashion')}><Button className='!w-full !text-left !text-trozzi-charcoal hover:!bg-trozzi-ivory hover:!text-trozzi-terracotta transition-colors'>Tops</Button></NavLink></li>
                                <li><NavLink to={routeForMenuItem('Fashion')}><Button className='!w-full !text-left !text-trozzi-charcoal hover:!bg-trozzi-ivory hover:!text-trozzi-terracotta transition-colors'>Skirts</Button></NavLink></li>
                                <li><NavLink to={routeForMenuItem('Fashion')}><Button className='!w-full !text-left !text-trozzi-charcoal hover:!bg-trozzi-ivory hover:!text-trozzi-terracotta transition-colors'>Frocks</Button></NavLink></li>
                              </ul>
                            </div>
                          </li>
                        </ul>
                      </div>
                    )}

                    {/* Electronics -> Submenu */}
                    {item === 'Electronics' && (
                      <div className='submenu absolute top-[100%] left-0 min-w-[220px] bg-trozzi-white shadow-xl border border-trozzi-sand opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 rounded-xl overflow-hidden z-50'>
                        <ul>
                          <li><NavLink to={routeForMenuItem('Electronics')}><Button className='!w-full !text-left !text-trozzi-charcoal hover:!bg-trozzi-ivory hover:!text-trozzi-terracotta transition-colors'>Laptop</Button></NavLink></li>
                          <li><NavLink to={routeForMenuItem('Electronics')}><Button className='!w-full !text-left !text-trozzi-charcoal hover:!bg-trozzi-ivory hover:!text-trozzi-terracotta transition-colors'>Smartwatch</Button></NavLink></li>

                          {/* Mobile with nested submenu */}
                          <li className='list-none relative group/sub'>
                            <NavLink to={routeForMenuItem('Electronics')}><Button className='!w-full !text-left !text-trozzi-charcoal hover:!bg-trozzi-ivory hover:!text-trozzi-terracotta transition-colors'>Mobile</Button></NavLink>
                            <div className='submenu absolute top-0 left-[100%] min-w-[200px] bg-trozzi-white shadow-xl border border-trozzi-sand opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-200 rounded-xl overflow-hidden z-50'>
                              <ul>
                                <li><NavLink to={routeForMenuItem('Electronics')}><Button className='!w-full !text-left !text-trozzi-charcoal hover:!bg-trozzi-ivory hover:!text-trozzi-terracotta transition-colors'>Vivo</Button></NavLink></li>
                                <li><NavLink to={routeForMenuItem('Electronics')}><Button className='!w-full !text-left !text-trozzi-charcoal hover:!bg-trozzi-ivory hover:!text-trozzi-terracotta transition-colors'>Oppo</Button></NavLink></li>
                                <li><NavLink to={routeForMenuItem('Electronics')}><Button className='!w-full !text-left !text-trozzi-charcoal hover:!bg-trozzi-ivory hover:!text-trozzi-terracotta transition-colors'>iPhone</Button></NavLink></li>
                                <li><NavLink to={routeForMenuItem('Electronics')}><Button className='!w-full !text-left !text-trozzi-charcoal hover:!bg-trozzi-ivory hover:!text-trozzi-terracotta transition-colors'>Samsung</Button></NavLink></li>
                              </ul>
                            </div>
                          </li>
                          <li><NavLink to={routeForMenuItem('Electronics')}><Button className='!w-full !text-left !text-trozzi-charcoal hover:!bg-trozzi-ivory hover:!text-trozzi-terracotta transition-colors'>Charger</Button></NavLink></li>
                        </ul>
                      </div>
                    )}

                    {/* Bags -> Submenu */}
                    {item === 'Bags' && (
                      <div className='submenu absolute top-[100%] left-0 min-w-[220px] bg-trozzi-white shadow-xl border border-trozzi-sand opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 rounded-xl overflow-hidden z-50'>
                        <ul>
                          <li><NavLink to={routeForMenuItem('Bags')}><Button className='!w-full !text-left !text-trozzi-charcoal hover:!bg-trozzi-ivory hover:!text-trozzi-terracotta transition-colors'>Men</Button></NavLink></li>
                          <li><NavLink to={routeForMenuItem('Bags')}><Button className='!w-full !text-left !text-trozzi-charcoal hover:!bg-trozzi-ivory hover:!text-trozzi-terracotta transition-colors'>Women</Button></NavLink></li>
                        </ul>
                      </div>
                    )}

                    {/* Footwear -> Submenu */}
                    {item === 'Footwear' && (
                      <div className='submenu absolute top-[100%] left-0 min-w-[220px] bg-trozzi-white shadow-xl border border-trozzi-sand opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 rounded-xl overflow-hidden z-50'>
                        <ul>
                          <li><NavLink to={routeForMenuItem('Footwear')}><Button className='!w-full !text-left !text-trozzi-charcoal hover:!bg-trozzi-ivory hover:!text-trozzi-terracotta transition-colors'>Men</Button></NavLink></li>
                          <li><NavLink to={routeForMenuItem('Footwear')}><Button className='!w-full !text-left !text-trozzi-charcoal hover:!bg-trozzi-ivory hover:!text-trozzi-terracotta transition-colors'>Women</Button></NavLink></li>
                        </ul>
                      </div>
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Right: Info & Links */}
          <div className='col_3 flex-shrink-0 flex items-center gap-2 sm:gap-4'>
            <NavLink to="/help-center" className="text-xs sm:text-sm font-medium text-trozzi-charcoal hover:text-trozzi-terracotta transition-colors whitespace-nowrap">
              Help
            </NavLink>
            <NavLink to="/order-tracking" className="text-xs sm:text-sm font-medium text-trozzi-charcoal hover:text-trozzi-terracotta transition-colors whitespace-nowrap">
              Track
            </NavLink>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
