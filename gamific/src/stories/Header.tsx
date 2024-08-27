import React from 'react';
import { Button } from './Button';
import { Avatar } from './Avatar';

export interface User {
  name?: string | null
  email?: string | null
  image?: string | null
  imageType?: 'image' | 'initials' | 'none';
};

interface HeaderProps {
  user?: User;
  onLogin?: () => void;
  onLogout?: () => void;
}

export const Header = ({ user, onLogin, onLogout }: HeaderProps) => (
  <nav className="bg-white border border-gray-600 shadow-lg">
    <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto pl-5">
      <a href="http://localhost:3000" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="logo.png" className="h-8" alt="Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-blue-500">Gamific</span>
      </a>
      <div className="hidden w-full md:block md:w-auto pr-5 pt-6" id="navbar-default">
        {user == null ? 
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white">
            <li>
              <Button type="text" size="small" label="About Us"/>
            </li>
            <li>
              <Button type="text" size="small" label="Products"/>
            </li>
            <li>
              <Button type="contained" size="small" label="Log In" onClick={onLogin}/>
            </li>
          </ul> : 
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white">
            <li>
              <Avatar type={user.imageType} text={user.image} />
            </li>
            <li>
              <Button type="contained" size="small" label="Log Out" onClick={onLogout}/>
            </li>
          </ul>
        };
      </div>
    </div>
    </nav>
);
