import React from 'react';
import classNames from 'classnames';

const FooterNav = ({
  className,
  ...props
}) => {

  const classes = classNames(
    'footer-nav',
    className
  );

  return (
    <nav
      {...props}
      className={classes}
    >
      <ul className="list-reset">
        <li>
          <a href="https://twitter.com/arisegu">Contact</a>
        </li>
        <li>
          <a href="https://twitter.com/arisegu">About us</a>
        </li>
        <li>
          <a href="https://forms.gle/DRk2VoUAsum9SUxQ9">Support</a>
        </li>
      </ul>
    </nav>
  );
}

export default FooterNav;