'use client';
import React, { useState, useEffect } from 'react';

import Close from '../utils/icons/close';
import Filter from '../utils/icons/filter';
import Download from '../utils/icons/download';
import ColumnSettings from '../utils/icons/column-settings';

import Button from './Button';
import SearchBox from './SearchBox';
import DropdownFilter from './DropdownFilter';
import { IconInputType } from './Icon';


export type FilterInputs = {
  [key: string]: any,
};

export type DataTableManagerProps = {
  keyword?: string
  setKeyword?: (keyword: string) => void
  totalCount?: number
  isLoading?: boolean
  labels?: {
    searchLabel?: string,
    searchPlaceholder?: string,
    label: string,
    labelPlural: string,
  }
  // columns
  columns?: { label: string, value: string }[],
  selectedColumns?: string[],
  setColumns?: (c: string[]) => void,
  // filters
  filterConfig?: {
    key: string,
    options: {
      label: string,
      value: string,
    }[],
    labels?: {
      label?: string,
      searchLabel?: string,
      optionsTitle?: string,
    }
  }[],
  filters?: FilterInputs,
  setFilters?: (f: FilterInputs) => void,
  isFilteringInitialised?: boolean,
  // download
  showDownloadButton?: boolean,
  onDownload?: () => void,
  isDownloadLoading?: boolean,
  // selections
  selections?: {
    total: number,
    selected: number,
    excluded: number,
  },
  onCancelSelections?: () => void,
  selectionActions?: {
    label: string,
    onClick: () => void,
    isDisabled?: boolean,
    isHidden?: boolean,
    leftIcon?: IconInputType,
    rightIcon?: IconInputType,
  }[],
};

const defaultLabels = {
  label: 'Record',
  labelPlural: 'Records',
  searchLabel: 'Search',
  searchPlaceholder: 'Search...',
};


const DataTableManager = ({
  keyword, setKeyword, labels: _labels, isLoading = false, totalCount,
  filterConfig, filters, setFilters = () => {}, isFilteringInitialised,
  showDownloadButton = false, onDownload = () => {}, isDownloadLoading = false,
  columns, selectedColumns = [], setColumns = () => {},
  selections, onCancelSelections = () => {}, selectionActions = [],
}: DataTableManagerProps) => {

  const labels = { ...defaultLabels, ..._labels };
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [_keyword, _setKeyword] = useState(keyword || '');
  const [showFilters, setShowFilters] = useState(isFilteringInitialised);

  useEffect(() => {
    _setKeyword(keyword || '');
  }, [keyword]);

  useEffect(() => {
    setShowFilters(isFilteringInitialised);
  }, [isFilteringInitialised]);

  return (
    <div>
      <div className="md:dsr-flex dsr-justify-between dsr-items-center dsr-gap-3">
        <div className="md:dsr-flex dsr-items-center dsr-w-full dsr-p-2">
          {(typeof keyword === 'string' && typeof setKeyword === 'function') ? (
            <SearchBox
              hideLabel
              labels={{
                label: labels.searchLabel,
                placeholder: labels.searchPlaceholder,
              }}
              keyword={_keyword}
              setKeyword={_setKeyword}
              onSearch={(k) => setKeyword(k)}
              className="dsr-w-full"
            />
          ) : null}
          {!isLoading && (
            <div className="dsr-p-2 dsr-w-[150px] dsr-max-w-full">
              {`${totalCount ?? 0} ${labels.labelPlural}`}
            </div>
          )}
        </div>
        <div className="dsr-flex dsr-gap-3 dsr-p-2">
          {(filters && !showFilters) && (
            <Button
              type="button"
              variant="minimal"
              color="shade"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter />
            </Button>
          )}
          {(columns && columns?.length > 0) ? (
            <DropdownFilter
              options={columns}
              labels={{
                searchLabel: 'Search for Columns',
                optionsTitle: 'Columns',
                searchPlaceholder: 'Search Columns',
              }}
              selections={selectedColumns}
              setSelections={(columns) => setColumns(columns ?? [])}
            >
              <Button
                type="button"
                color="shade"
                variant="minimal"
              >
                <ColumnSettings />
              </Button>
            </DropdownFilter>
          ) : null}
          {showDownloadButton && (
            <Button
              type="button"
              variant="minimal"
              color="shade"
              onClick={onDownload}
              isLoading={isDownloadLoading}
              isDisabled={isDownloadLoading}
            >
              <Download />
            </Button>
          )}
        </div>
      </div>
      {(showFilters && filterConfig) && (
        <div className="dark:dsr-bg-gray-500/20 dsr-bg-gray-500/10 dsr-border dark:dsr-border-neutral-500/70 dsr-border-neutral-500/10 dsr-mx-2 dsr-mb-2 dsr-shadow-inner dsr-rounded-lg dsr-p-2">
          <div className="dsr-flex dsr-items-center dsr-flex-wrap dsr-gap-3">
            {filterConfig.filter((f) => f.options.length).map((f) => (
              <div key={f.key} className="dsr-p-1">
                <DropdownFilter
                  options={f.options}
                  labels={{
                    searchLabel: f.labels?.searchLabel,
                    optionsTitle: f.labels?.optionsTitle,
                  }}
                  selections={filters?.[f.key] || []}
                  setSelections={(selections) => setFilters({ ...filters, [f.key]: selections ?? [] })}
                >
                  <Button
                    variant={filters?.[f.key] && filters?.[f.key]?.length && filters?.[f.key]?.length < f.options.length ? 'solid' : 'minimal'}
                    color={filters?.[f.key] && filters?.[f.key]?.length && filters?.[f.key]?.length < f.options.length ? 'primary' : 'shade'}
                    size="sm"
                    className="dsr-flex dsr-items-center dsr-gap-1"
                  >
                    <Filter />
                    {f.labels?.label}
                  </Button>
                </DropdownFilter>
              </div>

            ))}
          </div>
          <div className="dsr-flex dsr-items-center dsr-flex-wrap dsr-gap-2 dsr-mt-1 dsr-border-t dsr-pt-2">
            {filterConfig.filter((f) => f.options.length && filters?.[f.key]?.length && f.options.length != filters?.[f.key]?.length).map((f) => (
              <div className="md:dsr-flex dsr-items-center dsr-pb-3 dsr-pt-1" key={f.key}>
                {(f.labels && f.labels.label && f.labels.label?.length > 0) ? (
                  <div className="md:dsr-mr-2 dsr-mb-1 md:dsr-mb-0 dsr-text-sm dsr-font-semibold">
                    {`${f.labels?.label}:`}
                  </div>
                ) : null}
                {filters?.[f.key]?.map((s: any, index: number) => (
                  <Button
                    size="xs"
                    key={index}
                    variant="minimal"
                    className="dsr-mr-1"
                    onClick={() => setFilters({
                      ...filters,
                      [f.key]: filters?.[f.key]?.filter((_s: any) => _s !== s),
                    })}
                  >
                    {filterConfig?.find((c) => f.key === c.key)?.options?.find((o) => o.value === s)?.label}
                    <Close size={12} />
                  </Button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
      {(selections && (selections?.selected || selections.excluded)) ? (
        <div className="dsr-flex dsr-flex-wrap dark:dsr-bg-gray-500/20 dsr-bg-gray-500/10 dsr-border dark:dsr-border-neutral-500/70 dsr-border-neutral-500/10 dsr-shadow px-2 py-1 dsr-mx-0">
          <div className="dsr-w-full md:dsr-w-1/2 lg:dsr-w-1/3 dsr-px-3 dsr-py-2 dsr-flex dsr-items-center dsr-font-semibold dsr-gap-2">
            {selections?.selected ? `${selections?.selected} selected` : null}
            {selections?.excluded ? `${selections?.excluded} excluded` : null}
            <Button
              variant="link"
              color="danger"
              size="xl"
              className="!dsr-no-underline"
              title="Cancel Selections"
              rightIcon="times"
              onClick={onCancelSelections}
            />
          </div>
          <div className="dsr-w-full md:dsr-w-1/2 lg:dsr-w-2/3 dsr-px-2 dsr-py-2 dsr-flex dsr-items-center dsr-justify-end dsr-gap-1">
            {selectionActions?.filter((a) => !a.isHidden).map((a) => (
              <Button
                variant="minimal"
                color="shade"
                className="!dsr-py-1"
                key={a.label}
                title={a.label}
                isDisabled={a.isDisabled}
                leftIcon={a.leftIcon}
                rightIcon={a.rightIcon}
                onClick={a.onClick}
              >
                {a.label}
              </Button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );

};

export default DataTableManager;