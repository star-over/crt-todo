import React from 'react';
import s from './Header.module.css';

export interface IHeaderMessage {
  text: string
}

export const Header = ({ text }: IHeaderMessage): JSX.Element => (
  <header className={s.appHeader}>
    <div>{text}</div>
  </header>
);