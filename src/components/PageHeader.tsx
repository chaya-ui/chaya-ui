import React from 'react';
import Color from 'color';
import styled from '@emotion/styled';

import Breadcrumb, { BreadcrumbPropType } from './Breadcrumb';

const PageHeaderSection = styled.section`
    background: ${({ theme }) => theme?.isDarkTheme ? Color(theme.background || '#000').lighten(0.2).hex() : Color(theme.background || '#FFF').darken(0.15).hex() };
    p {
        font-size: calc(1rem + 0.25vw);
    }
    &.page-header-lg {
      padding: 3.5vh 3.5vw;
    }
    &.page-header-sm {
        padding: 1.5vh 1.5vw;
    }
`;

type PageHeader = {
    title?: string,
    customTitle?: React.ReactElement,
    description?: string,
    id?: string,
    size?: ('lg'|'sm')
    className?: string,
    headingClassName?: string,
    breadcrumb?: BreadcrumbPropType,
    breadcrumbItems?: {
        link: string,
        title: string,
        isActive?: boolean
    }[],
    titleBottomRenderer?: () => (React.ReactChildren|React.ReactNode|React.ReactElement),
    sidebarRenderer?: () => (React.ReactChildren|React.ReactNode|React.ReactElement)
    customRender?: () => (React.ReactChildren|React.ReactNode|React.ReactElement),
}

const PageHeader = ({
    title, description, className = '', headingClassName = '', id,
    breadcrumbItems = [], size = 'lg',
    customRender = () => <div />,
    titleBottomRenderer = () => <div />,
    sidebarRenderer = () => <div />,
    customTitle = null, breadcrumb = null
} : PageHeader) => (
    <PageHeaderSection id={id} className={`page-header page-header-${size} ${className}`}>
        <div>
            <div className="flex flex-wrap">
                <div className="md:w-2/3 py-2">
                    <div className={size == "lg" ? "px-2 mb-4" : "mb-2" }>
                        <Breadcrumb
                            {...breadcrumb}
                            items={breadcrumbItems}
                            className={`${size == "sm" ? "text-sm mb-0" : ''}`}
                        />
                    </div>
                    {customTitle ? customTitle : <h1 aria-level={1} className={`${size == 'lg' ? `text-6xl` : 'text-3xl'}  font-semibold ${headingClassName}`} role="heading">{title}</h1>}
                    {description?.length > 0 && <p className="text-lg opacity-80 mt-3">{description}</p>}
                    {titleBottomRenderer()}
                </div>
                <div className="md:w-1/3 py-2 flex justify-end items-center">
                    {sidebarRenderer()}
                </div>
            </div>
            {customRender && customRender()}
        </div>
    </PageHeaderSection>
);

export default PageHeader;