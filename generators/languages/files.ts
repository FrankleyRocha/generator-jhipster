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
import { asWriteFilesSection } from '../base-application/support/task-type-inference.ts';
import { CLIENT_MAIN_SRC_DIR } from '../generator-constants.js';
import type { Application as LanguagesApplication } from './types.js';

export const clientI18nFiles = asWriteFilesSection<LanguagesApplication>({
  clientI18nFiles: [
    {
      from: context => `${CLIENT_MAIN_SRC_DIR}/i18n/${context.lang}/`,
      to: context => `${context.clientSrcDir}/i18n/${context.lang}/`,
      transform: false,
      templates: ['error.json', 'login.json', 'password.json', 'register.json', 'sessions.json', 'settings.json'],
    },
    {
      condition: ctx => ctx.clientFrameworkVue && ctx.enableTranslation && !ctx.microfrontend,
      path: `${CLIENT_MAIN_SRC_DIR}/i18n/`,
      renameTo: context => `${context.clientSrcDir}/i18n/${context.lang}/${context.lang}.js`,
      templates: ['index.js'],
    },
    {
      from: context => `${CLIENT_MAIN_SRC_DIR}/i18n/${context.lang}/`,
      to: context => `${context.clientSrcDir}/i18n/${context.lang}/`,
      templates: ['activate.json', 'global.json', 'home.json', 'reset.json'],
    },
    {
      condition: context => context.withAdminUi,
      from: context => `${CLIENT_MAIN_SRC_DIR}/i18n/${context.lang}/`,
      to: context => `${context.clientSrcDir}/i18n/${context.lang}/`,
      transform: false,
      templates: [
        'configuration.json',
        'logs.json',
        'metrics.json',
        {
          transform: true,
          file: 'health.json',
        },
      ],
    },
    {
      condition: context => context.communicationSpringWebsocket,
      from: context => `${CLIENT_MAIN_SRC_DIR}/i18n/${context.lang}/`,
      to: context => `${context.clientSrcDir}/i18n/${context.lang}/`,
      transform: false,
      templates: ['tracker.json'],
    },
    {
      condition: context => context.applicationTypeGateway,
      from: context => `${CLIENT_MAIN_SRC_DIR}/i18n/${context.lang}/`,
      to: context => `${context.clientSrcDir}/i18n/${context.lang}/`,
      transform: false,
      templates: ['gateway.json'],
    },
  ],
});
