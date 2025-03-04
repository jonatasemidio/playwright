/*
  Copyright (c) Microsoft Corporation.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import './toolbarButton.css';
import '../third_party/vscode/codicon.css';
import * as React from 'react';

export interface ToolbarButtonProps {
  title: string,
  icon?: string,
  disabled?: boolean,
  toggled?: boolean,
  onClick: () => void,
}

export const ToolbarButton: React.FC<React.PropsWithChildren<ToolbarButtonProps>> = ({
  children,
  title = '',
  icon,
  disabled = false,
  toggled = false,
  onClick = () => {},
}) => {
  let className = `toolbar-button ${icon}`;
  if (toggled)
    className += ' toggled';
  return <button
    className={className}
    onMouseDown={preventDefault}
    onClick={onClick}
    title={title}
    disabled={!!disabled}>
    {icon && <span className={`codicon codicon-${icon}`} style={children ? { marginRight: 5 } : {}}></span>}
    {children}
  </button>;
};

const preventDefault = (e: any) => e.preventDefault();
