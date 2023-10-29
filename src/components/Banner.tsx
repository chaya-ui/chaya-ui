import React from 'react';
import clsx from 'clsx';

import DocumentPortal from '../utils/Portal';
import useColors, { ChayaColorType } from '../hooks/useColors';

import Icon, { IconInputType } from './Icon';

export type BannerProps = {
  className?: string,
  variant?: 'full-width' | 'float' | 'card',
  color?: ChayaColorType,
  position?: 'top' | 'bottom' | 'inline',
  text?: string,
  icon?: IconInputType,
  allowDismissal?: boolean,
  children?: React.ReactNode,
  learnMore?: {
    link: string,
    text: string,
  }
  onClose?: () => void,
};


const Banner = ({
  className, variant, onClose, position = 'top', text, color = 'primary', icon,
  allowDismissal, children, learnMore,
}: BannerProps) => {

  const { activeColor, textColor } = useColors('solid', color);

  const cardRenderer = (
    <div
      className={clsx([
        'dsr-p-4 dsr-max-w-[700px] dsr-right-0',
        position === 'top' ? 'dsr-top-0 dsr-fixed dsr-flex dsr-justify-end' : position === 'bottom' ? 'dsr-bottom-0 dsr-fixed dsr-flex dsr-justify-end' : '',
      ])}
    >
      <div
        className={clsx([
          'dsr-p-5 dsr-flex dsr-flex-col dsr-gap-4 dsr-flex-wrap md:dsr-flex-nowrap dsr-text-center md:dsr-text-left dsr-items-center dsr-justify-center md:dsr-justify-between',
          variant !== 'full-width' ? 'dsr-rounded-lg' : '',
          className,
          variant !== 'full-width' && 'dsr-shadow-lg',
        ])}
        style={{ backgroundColor: activeColor, color: textColor }}
      >
        <div className="dsr-w-full dsr-flex dsr-justify-end">
          <div
            className={clsx([
              'dsr-flex dsr-justify-between',
              icon && 'dsr-w-full',
            ])}
          >
            {icon && <Icon icon={icon} size={20} />}
            {allowDismissal && (
              <button type="button" className="dsr-flex dsr-place-items-center" onClick={onClose}>
                <Icon icon="times" size={20} />
              </button>
            )}
          </div>
        </div>
        <p>
          {text || 'Banner text'}
          ' '
          {learnMore && <a href={learnMore.link} className="dsr-whitespace-nowrap hover:dsr-underline dsr-inline">{learnMore.text}</a>}
        </p>
        <div className="dsr-flex dsr-w-full dsr-justify-end">
          <div>{children}</div>
        </div>
      </div>
    </div>
  );

  const bannerRenderer = (
    <div
      className={clsx([
        'dsr-w-full dsr-left-0 dsr-right-0',
        position === 'top' ? 'dsr-top-0' : position === 'bottom' ? 'dsr-bottom-0' : '',
        variant === 'float' ? 'dsr-p-4' : variant === 'full-width' ? 'dsr-sticky' : '',
        position !== 'inline' ? 'dsr-fixed' : '',
      ])}
    >
      <div
        className={clsx([
          'dsr-w-full dsr-p-5 dsr-flex dsr-gap-4 dsr-flex-wrap md:dsr-flex-nowrap dsr-text-center md:dsr-text-left dsr-items-center dsr-justify-center md:dsr-justify-between',
          variant !== 'full-width' ? 'dsr-rounded-lg dsr-shadow-lg' : '',
          className,
        ])}
        style={{ backgroundColor: activeColor, color: textColor }}
      >
        <div className="dsr-w-full dsr-flex dsr-gap-4 dsr-place-items-center">
          {icon && <Icon icon={icon} size={20} />}
          <p>
            {text || 'Banner text'}
            ' '
            {learnMore && <a href={learnMore.link} className="dsr-whitespace-nowrap  hover:dsr-underline dsr-inline">{learnMore.text}</a>}
          </p>
        </div>
        <div className="dsr-flex dsr-gap-4 dsr-items-center dsr-flex-shrink-0">
          {children}
          {allowDismissal && (
          <button type="button" className="dsr-flex dsr-place-items-center" onClick={onClose}>
            <Icon icon="times" size={20} />
          </button>
          )}
        </div>
      </div>
    </div>
  );

  const renderer = () => (variant === 'card') ? cardRenderer : bannerRenderer;

  return (
    <div className="dsr-w-full">
      {position === 'inline' ? (renderer()) : (
        <DocumentPortal position={position === 'top' ? 'start' : 'end'}>
          {renderer()}
        </DocumentPortal>
      )}
    </div>
  );
};

export default Banner;