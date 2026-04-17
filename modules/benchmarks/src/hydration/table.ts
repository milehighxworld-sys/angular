/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */

import {Component, Input} from '@angular/core';
import {DomSanitizer, SafeStyle} from '@angular/platform-browser';

import {TableCell} from './util';

let trustedEmptyColor: SafeStyle;
let trustedGreyColor: SafeStyle;

@Component({
  standalone: true,
  selector: 'app',
  template: ``,
})
export class AppComponent {
  constructor(sanitizer: DomSanitizer) {
    trustedEmptyColor = sanitizer.bypassSecurityTrustStyle('white');
    trustedGreyColor = sanitizer.bypassSecurityTrustStyle('grey');
  }
}

@Component({
  standalone: true,
  selector: 'table-cmp',
  template: `
    <table>
      <tbody>
        @for (row of data; track $index) {
          <tr>
            @for (cell of row; track $index) {
              <td [style.backgroundColor]="getColor(cell.row)">
                {{ cell.value + '!' }}
              </td>
            }
          </tr>
        }
      </tbody>
    </table>
  `,
})
export class TableComponent {
  @Input() data: TableCell[][] = [];

  getColor(row: number) {
    return row % 2 ? trustedEmptyColor : trustedGreyColor;
  }
}

export function setupTransferState(cols: string, rows: string) {
  const parsedCols = Number.parseInt(cols, 10);
  const parsedRows = Number.parseInt(rows, 10);
  const safeCols = Number.isFinite(parsedCols) ? Math.max(0, parsedCols) : 40;
  const safeRows = Number.isFinite(parsedRows) ? Math.max(0, parsedRows) : 200;

  const script = document.createElement('script');
  script.id = 'ng-state';
  script.type = 'application/json';
  // This script contains hydration annotation for the `TableComponent` component.
  // Note: if you change the `TableComponent` template, make sure to update this
  // annotation as well.
  const hydrationState = {
    __nghData__: [
      {
        t: {'3': 't0'},
        c: {
          '3': [
            {
              i: 't0',
              r: 1,
              t: {'2': 't1'},
              c: {'2': [{i: 't1', r: 1, x: safeCols}]},
              x: safeRows,
            },
          ],
        },
      },
    ],
  };
  script.textContent = JSON.stringify(hydrationState);
  document.body.insertBefore(script, document.body.firstChild);
}
