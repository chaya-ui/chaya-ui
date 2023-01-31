import React, { useContext, useMemo, useState } from 'react';
import Color from 'color';
import tailwindColors from 'tailwindcss/colors';
import clsx from 'clsx';

import { LinkWrapper } from '../../utils/misc';
import DSRContext from '../../contexts/DSRContext';
import { RGBAtoRGB } from '../../utils/color';

import buttonStyle from './button.module.scss';
import { ButtonProps } from './type';
import Ripple from './Ripple';

const sizeDefinitions = {
  xs: 'dsr-px-1 dsr-py-0 dsr-text-xs',
  sm: 'dsr-px-2 dsr-py-1 dsr-text-sm',
  md: 'dsr-px-3 dsr-py-2 dsr-text-base',
  lg: 'dsr-px-5 dsr-py-3 dsr-text-lg',
  xl: 'dsr-px-6 dsr-py-4 dsr-text-xl',
};

const Button = ({
  variant = 'solid', color = 'primary', size = 'md',
  children, link, onClick = () => {},
  className = '', style, label, disableRipple = false,
  target, type, rel, disabled, id,
}: ButtonProps) => {
  const [hover, setHover] = useState(false);
  const { theme, isDarkTheme } = useContext(DSRContext);

  const activeColor = useMemo(() => {
    const background = Color(theme?.background);

    const colors = {
      primary: theme?.primary,
      secondary: theme?.secondary,
      success: tailwindColors.green['600'],
      danger: tailwindColors.red['500'],
      warning: tailwindColors.yellow['500'],
      contrast: background.negate().toString(),
      shade: isDarkTheme ? background.lighten(3).toString() : background.darken(0.6).toString(),
    };

    return colors[color];
  }, [theme, color]);

  const backgroundColor = useMemo(() => {
    const backgroundColors = {
      solid: activeColor,
      outline: 'rgba(0, 0, 0, 0)',
      minimal: Color(RGBAtoRGB(
        Color(activeColor).fade(0.70),
        isDarkTheme ? 40 : 255,
      )).toString(),
      link: 'rgba(0, 0, 0, 0)',
    };

    return backgroundColors[variant];
  }, [activeColor, variant]);

  const textColor = useMemo(
    () => {
      if (variant === 'solid' || (variant === 'outline' && hover)) return Color(activeColor).isDark() ? '#fff' : '#333';
      else if (variant === 'minimal' && color === 'contrast') return Color(backgroundColor).isDark() ? '#fff' : '#333';
      return activeColor;
    },
    [activeColor, variant, hover],
  );

  const hoverColor = useMemo(() => {
    switch (variant) {
      case 'solid': return Color(activeColor).darken(0.2).toString();
      case 'outline': return activeColor;
      case 'minimal': return Color(backgroundColor).darken(0.1).toString();
    }
  }, [activeColor]);

  const linkRenderer = () => (
      <React.Fragment>
          {(!disableRipple && !disabled) && <Ripple />}
          {children}
      </React.Fragment>
  );

  const computedClassName = clsx([
    className,
    sizeDefinitions[size],
    buttonStyle.button,
    variant === 'link' ? 'hover:dsr-underline' : '',
    'button dsr-rounded-lg dsr-inline-block dsr-relative dsr-overflow-hidden dsr-text-center dsr-border dsr-border-transparent dsr-transition',
  ]);

  const computedStyle = {
    background: hover ? hoverColor : backgroundColor,
    color: textColor,
    borderColor: variant === 'outline' ? activeColor : 'none',
    ...style,
  };

  const buttonRenderer = () => (
      <button
          id={id}
          aria-label={label}
          type={type}
          onClick={e => {
            e.stopPropagation();
            onClick(e);
          }}
          disabled={disabled}
          aria-disabled={disabled}
          className={computedClassName}
          style={computedStyle}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
      >
          {(!disableRipple && !disabled) && <Ripple />}
          {children}
      </button>
  );

  return link ? LinkWrapper(link, linkRenderer(), {
    target, rel, id, label,
    className: computedClassName,
    style: computedStyle,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
  }) : buttonRenderer();
};

export { ButtonProps as ButtonProps };
export default Button;