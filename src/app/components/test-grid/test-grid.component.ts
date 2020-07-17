import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AllModules } from '@ag-grid-enterprise/all-modules/dist/ag-grid-enterprise.js';

import { GridDataService } from '../../services/grid-data.service';
import { MapDataToRowModelService } from '../../services/map-data-to-row-model.service';
import { ImageThumbnailsComponent } from '../image-thumbnails/image-thumbnails.component';
import { VideoTitleComponent } from '../video-title/video-title.component';
import { CheckboxHeaderComponent } from '../checkbox-header/checkbox-header.component';
import { SelectionToolPanelComponent } from '../selection-tool-panel/selection-tool-panel.component';
import { MenuItemDef } from 'ag-grid-community';
import { CheckboxCellComponent } from '../checkbox-cell/checkbox-cell.component';
import { LinkService } from '../../services/link.service';

@Component({
  selector: 'app-test-grid',
  templateUrl: './test-grid.component.html',
  styleUrls: ['./test-grid.component.scss']
})
export class TestGridComponent implements OnInit, OnDestroy {

  constructor(private gridData: GridDataService,
              private mapDataToRowModel: MapDataToRowModelService,
              private useLink: LinkService) { }

  private subscription = new Subscription();
  public rowSelection = 'multiple';
  public modules = AllModules;
  public rowData: any;

  public columnDefs = [
    {
      field: 'checkbox',
      headerComponentFramework: CheckboxHeaderComponent,
      sortable: false,
      maxWidth: 40,
      cellRendererFramework: CheckboxCellComponent,
      hide: true
    },
    {
      headerName: '',
      field: 'thumbnails',
      minWidth: 70,
      maxWidth: 70,
      sortable: false,
      cellRendererFramework: ImageThumbnailsComponent
    },
    {
      headerName: 'Published on',
      field: 'publishedAt',
      enableValue: true,
      maxWidth: 180
    },
    {
      headerName: 'Video Title',
      field: 'title',
      maxWidth: 200,
      cellRendererFramework: VideoTitleComponent
    },
    {
      headerName: 'Description',
      field: 'description'
    }
  ];
  public defaultColDef = {
    flex: true,
    minWidth: 70,
    sortable: true,
    autoHeight: true,
    enableValue: true,
    enableRowGroup: true,
    enablePivot: true
  };

  public sideBar = {
    toolPanels: [
      {
        id: 'selection',
        labelDefault: 'Selection',
        labelKey: 'selection',
        iconKey: 'selection',
        toolPanel: 'selectionToolPanel'
      }
    ]
  };
  public frameworkComponents = { selectionToolPanel: SelectionToolPanelComponent };

  getContextMenuItems = (params): Array<string | MenuItemDef> => {
    const result: Array<string | MenuItemDef> = [
      'copy',
      'copyWithHeaders',
      'paste'
    ];
    if (params.column.getColId() === 'title') {
      const openInNewTabFeature: MenuItemDef = {
        name: 'Open in new tab',
        action: () => {
          this.useLink.openInNewTab(params.value);
        }
      };
      result.push(openInNewTabFeature);
    }
    return result;
  }

  ngOnInit(): void {
    const rowDataSubscription = this.gridData.getData().pipe(
      catchError(error => {
        console.log('Error', error);
        return throwError(error);
      })
    ).subscribe((sourceData) => {
      this.rowData = this.mapDataToRowModel.createRows(sourceData);
    });
    this.subscription.add(rowDataSubscription);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
