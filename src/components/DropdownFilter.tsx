'use client';
import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { nanoid } from 'nanoid';
import clsx from 'clsx';
import _ from 'lodash';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import SearchBox from './SearchBox';
import Dropdown from './Dropdown';
import ListViewItem from './ListView/item';
import { IconInputType } from './Icon';

const defaultLabels = {
  searchPlaceholder: 'Search',
  searchLabel: 'Search',
  optionsTitle: 'Options',
  selectAll: 'Select All',
  clearAll: 'Clear All',
};

export type DropdownFilterOptionType = {
  label: string,
  value: any,
  iconRenderer?: React.ReactNode,
  iconURL?: string,
  icon?: IconInputType,
  isDisabled?: boolean,
  description?: string,
};

type DropdownCommonProps = {
  labels?: {
    searchPlaceholder?: string,
    searchLabel?: string,
    optionsTitle?: string,
    selectAll?: string,
    clearAll?: string,
  }
  options?: DropdownFilterOptionType[],
  isAsync?: boolean,
  onFetch?: (keyword: string) => Promise<DropdownFilterOptionType[]>,
  optionButtonClassName?: string;
  selections: null | any[];
  setSelections?: (selections: null | any[]) => void;
};

export type DropdownFilterProps = DropdownCommonProps & {
  children: ReactElement;
  dropdownContainerClassName?: string;
  onChangeKeyword?: (keyword: string) => void;
};

type DropdownRenderProps = DropdownCommonProps & {
  keyword: string;
  setKeyword: (keyword: string) => void;
  onLoad: () => void;
  isFetching: boolean;
};

const DropdownRender = ({
  labels: _labels, keyword, options, setKeyword, selections, setSelections = () => {}, onLoad = () => {},
  optionButtonClassName, isFetching = false,
}: DropdownRenderProps) => {

  const labels = { ...defaultLabels, ..._labels };
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);
  const optionRefs = React.useRef<Array<React.RefObject<any>>>([]);

  useEffect(onLoad, []);

  const availableOptions = options ? options.filter((f) => keyword.length == 0 || f.label.toLowerCase().startsWith(keyword.toLowerCase())) : [];

  useEffect(() => {
    optionRefs.current = Array(availableOptions.length).fill(null).map(() => React.createRef());
  }, [availableOptions.length]);


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key == 'ArrowDown' || e.key == 'ArrowUp') e.preventDefault();
    switch (e.key) {
      case 'ArrowDown':
        if (highlightedIndex < availableOptions.length - 1) {
          setHighlightedIndex(highlightedIndex + 1);
          optionRefs.current[highlightedIndex + 1].current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          setHighlightedIndex(0);
          optionRefs.current[0].current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        break;
      case 'ArrowUp':
        if (highlightedIndex > 0) {
          setHighlightedIndex(highlightedIndex - 1);
          optionRefs.current[highlightedIndex - 1].current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          setHighlightedIndex(availableOptions.length - 1);
          optionRefs.current[availableOptions.length - 1].current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        break;
      case 'Home':
        setHighlightedIndex(0);
        optionRefs.current[0].current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        break;
      case 'End':
        setHighlightedIndex(availableOptions.length - 1);
        optionRefs.current[availableOptions.length - 1].current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        break;
      case 'Enter':
        if (highlightedIndex != null) {
          const option = availableOptions[highlightedIndex].value;
          if (selections?.includes(option)) {
            setSelections(selections.filter((s) => s != option));
          } else {
            setSelections([...(selections || []), option]);
          }
        }
    }
  };

  return (
    <div>
      <div>
        <SearchBox
          hideLabel
          autoFocus
          keyword={keyword}
          inputClassName="dsr-py-1 dsr-px-2 !dsr-border-0 !dsr-rounded-b-none !dsr-border-b !dsr-bg-transparent !dsr-border-neutral-200/50"
          buttonClassName="dsr-p-1 !dsr-border-none !dsr-outline-none !dsr-rounded-b-none !dsr-bg-transparent"
          buttonWrapperClassName="!dsr-border-0 !dsr-outline-none !dsr-rounded-b-none !dsr-border-b !dsr-bg-transparent !dsr-border-neutral-200/50"
          onKeyDown={handleKeyDown}
          labels={{
            placeholder: labels.searchPlaceholder,
            label: labels.searchLabel,
          }}
          setKeyword={setKeyword}
        />
      </div>
      <div className="dsr-w-full dsr-px-2 dsr-py-1 dsr-bg-background dsr-border-b dsr-border-neutral-200/50">
        <span className="dsr-opacity-80 dsr-uppercase dsr-font-semibold dsr-text-xs">
          {labels.optionsTitle}
        </span>
      </div>
      <div className="dsr-max-h-[30vh] dsr-overflow-y-auto">
        {isFetching ? (
          <div>
            Fetching
          </div>
        ) : (
          <ul tabIndex={-1} role="listbox">
            {availableOptions.map((field, index) => (
              <DropdownMenu.Item
                key={nanoid()}
                className="!dsr-outline-0"
                ref={optionRefs.current[index]}
              >
                <ListViewItem
                  isHighlighted={index == highlightedIndex}
                  isSelectable
                  isSelected={selections?.includes(field.value)}
                  className={optionButtonClassName}
                  item={{
                    title: field.label,
                    id: field.value,
                    description: field.description,
                    iconRenderer: field.iconRenderer,
                    icon: field.icon,
                    iconURL: field.iconURL,
                    isDisabled: field.isDisabled,
                    onClick: () => setSelections(
                      selections ? (
                        selections.includes(field.value) ?
                          [...selections.filter((selection) => selection !== field.value)] :
                          [...selections, field.value]
                      ) : [field.value],
                    ),
                  }}
                  onSelect={() => setSelections(
                    selections ? (
                      selections.includes(field.value) ?
                        [...selections.filter((selection) => selection !== field.value)] :
                        [...selections, field.value]
                    ) : [field.value],
                  )}
                />
              </DropdownMenu.Item>
            ))}
          </ul>
        )}
      </div>
      <div className="dsr-flex dsr-justify-between dsr-border-t dsr-border-neutral-200/50 dsr-items-center">
        <button
          key={nanoid()}
          className={clsx([
            'dsr-flex dsr-items-center dsr-text-center dsr-rounded-b-lg dsr-font-semibold dsr-justify-center',
            'dsr-gap-2 dsr-px-3 dsr-py-2 hover:dsr-bg-white/20 dsr-w-full',
            'dsr-border-r dsr-border-neutral-200/50',
            'hover:dsr-bg-neutral-500/10 dsr-rounded-r-none',
          ])}
          onClick={() => setSelections(availableOptions.map((f) => f.value))}
        >
          {labels.selectAll}
        </button>
        <button
          key={nanoid()}
          className={clsx([
            'dsr-flex dsr-items-center dsr-text-center dsr-rounded-b-lg dsr-font-semibold dsr-justify-center',
            'dsr-gap-2 dsr-px-3 dsr-py-2 hover:dsr-bg-white/20 dsr-w-full',
            'hover:dsr-bg-neutral-500/10 dsr-rounded-l-none',
          ])}
          onClick={() => setSelections([])}
        >
          {labels.clearAll}
        </button>
      </div>
    </div>
  );
};

const DropdownFilter = ({
  children, selections, options: _options = [], labels: _labels,
  dropdownContainerClassName,
  optionButtonClassName,
  setSelections = () => {},
  onChangeKeyword = () => {},
  isAsync = false,
  onFetch = async () => [],
} : DropdownFilterProps) => {

  const [keyword, setKeyword] = useState<string>('');
  const initialRender = useRef(true);
  const labels = { ...defaultLabels, ..._labels };

  useEffect(() => {
    if (initialRender.current)
      initialRender.current = false;
    else
      onChangeKeyword(keyword);
  }, [keyword]);


  const [isFetching, setIsFetching] = useState(false);
  const [options, setOptions] = useState<DropdownFilterOptionType[]>(_options ?? []);

  useEffect(() => {
    const fetchOptions = _.debounce(async (searchKeyword: string) => {
      try {
        const fetchedOptions = await onFetch(searchKeyword);
        setOptions((prev) => {
          const newOptions = fetchedOptions.filter((option) => !prev.find((prevOption) => prevOption.value === option.value));
          return [...prev, ...newOptions];
        });
      } catch (error) {
      } finally {
        setIsFetching(false);
      }
    }, 500);

    if (isAsync) {
      setIsFetching(true);
      fetchOptions(keyword);
    }

    return () => {
      fetchOptions.cancel();
    };
  }, [isAsync, keyword, onFetch]);

  return (
    <Dropdown
      align="start"
      containerClassName={clsx([
        'dsr-z-[100] dsr-border dark:dsr-border-gray-500/70 dsr-border-gray-500/10',
        dropdownContainerClassName,
      ])}
      buttonRenderer={(
        <div className="dsr-w-fit">
          {children}
        </div>
      )}
    >
      <DropdownRender
        onLoad={() => onChangeKeyword(keyword)}
        labels={labels}
        keyword={keyword}
        setKeyword={setKeyword}
        selections={selections}
        setSelections={setSelections}
        options={options}
        isFetching={isFetching}
        optionButtonClassName={optionButtonClassName}
      />
    </Dropdown>
  );
};

export default DropdownFilter;
