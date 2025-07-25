/**
 * Copyright 2013-2025 the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster project, see https://www.jhipster.tech/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import JDLUnaryOption from '../../core/models/jdl-unary-option.js';
import JDLBinaryOption from '../../core/models/jdl-binary-option.js';
import { binaryOptions, unaryOptions } from '../../core/built-in-options/index.js';
import type AbstractJDLOption from '../../core/models/abstract-jdl-option.js';
import type { ParsedJDLOption, ParsedJDLOptionConfig, ParsedJDLUseOption } from '../../core/types/parsed.js';

const { OptionValues, getOptionName } = binaryOptions;
export default { convertOptions };

/**
 * Convert unary and binary options to JDLUnary & JDLBinary option classes.
 * @param {Object} parsedOptions - the parsed option object.
 * @param {Array<Object>} useOptions - the parsed option object, using the use form.
 * @returns {Array<JDLUnaryOption|JDLBinaryOption>} the converted JDLUnaryOption & JDLBinaryOption objects.
 */
export function convertOptions(
  parsedOptions: Record<string, ParsedJDLOptionConfig | Record<string, ParsedJDLOptionConfig>> | undefined,
  useOptions: ParsedJDLUseOption[],
): AbstractJDLOption[] {
  if (!parsedOptions) {
    throw new Error('Options have to be passed so as to be converted.');
  }
  const convertedUnaryOptions = convertUnaryOptions(parsedOptions as Record<string, ParsedJDLOption>);
  const convertedBinaryOptions = convertBinaryOptions(parsedOptions as Record<string, Record<string, ParsedJDLOption>>);
  const convertedUseOptions = convertUseOptions(useOptions);
  return [...convertedUnaryOptions, ...convertedBinaryOptions, ...convertedUseOptions];
}

function convertUnaryOptions(parsedOptions: Record<string, ParsedJDLOption>): JDLUnaryOption[] {
  const convertedUnaryOptions: JDLUnaryOption[] = [];
  unaryOptions.forEach((unaryOptionName: string) => {
    const parsedUnaryOption = parsedOptions[unaryOptionName];
    if (!parsedUnaryOption?.list || parsedUnaryOption.list.length === 0) {
      return;
    }
    convertedUnaryOptions.push(
      new JDLUnaryOption({
        name: unaryOptionName,
        entityNames: parsedUnaryOption.list,
        excludedNames: parsedUnaryOption.excluded,
      }),
    );
  });
  return convertedUnaryOptions;
}

function convertBinaryOptions(parsedOptions: Record<string, Record<string, ParsedJDLOption>>): JDLBinaryOption[] {
  const convertedBinaryOptions: JDLBinaryOption[] = [];
  binaryOptions.forEach((binaryOptionName: string) => {
    if (!parsedOptions[binaryOptionName]) {
      return;
    }
    const optionValues = Object.keys(parsedOptions[binaryOptionName]);
    optionValues.forEach(optionValue => {
      const parsedBinaryOption = parsedOptions[binaryOptionName][optionValue];
      convertedBinaryOptions.push(
        new JDLBinaryOption({
          name: binaryOptionName,
          value: optionValue,
          entityNames: parsedBinaryOption.list,
          excludedNames: parsedBinaryOption.excluded,
        }),
      );
    });
  });
  return convertedBinaryOptions;
}

function convertUseOptions(useOptions: ParsedJDLUseOption[]): JDLBinaryOption[] {
  const convertedUseOptions: JDLBinaryOption[] = [];

  useOptions.forEach(useValue => {
    const { optionValues, list, excluded } = useValue;

    optionValues.forEach(optionValue => {
      const optionName = (OptionValues as Record<string, string>)[optionValue];
      if (!optionName) {
        return;
      }
      convertedUseOptions.push(
        new JDLBinaryOption({
          name: getOptionName(optionName)!,
          value: optionValue,
          entityNames: list,
          excludedNames: excluded,
        }),
      );
    });
  });

  return convertedUseOptions;
}
