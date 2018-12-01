import React, { Component } from 'react';
import './App.css';


export const themes = {
  light: {
    background: '#cccccc',
  },
  dark: {
    background: '#800000',
  },
};

export const ThemeContext = React.createContext(
  themes.light 
);
  
  //export default Input;
  