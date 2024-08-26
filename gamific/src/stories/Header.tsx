import React from 'react';
import { Button } from './Button';
import { Avatar } from './Avatar';

export type User = {
  name: string;
  avatar: {
    type: 'image' | 'initials' | 'none';
    text: string;
  };
};

interface HeaderProps {
  user?: User;
  onLogin?: () => void;
  onLogout?: () => void;
  onCreateAccount?: () => void;
}

export const Header = ({ user, onLogin, onLogout, onCreateAccount }: HeaderProps) => (
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
              <Button type="outlined" size="small" label="Log In" onClick={onLogin}/>
            </li>
            <li>
              <Button type="contained" size="small" label="Sign Up" onClick={onCreateAccount}/>
            </li>
          </ul> : 
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white">
            <li>
              <Avatar type={user.avatar.type} text={user.avatar.text} />
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
