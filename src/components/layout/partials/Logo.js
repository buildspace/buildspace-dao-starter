import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import Image from '../../elements/Image';
import ReactLogo from './../../../assets/images/cropped-logo.png';
const Logo = ({
  className,
  ...props
}) => {

  const classes = classNames(
    'brand',
    className
  );

  return (
    <div
      {...props}
      className={classes}
    >
      <h1 className="m-0">
        <Link to="/">
          <Image
            src={ReactLogo}
            alt="Open"
            width={120}
            height={120}/>
        </Link>
      </h1>
    </div>
  );
}

export default Logo;