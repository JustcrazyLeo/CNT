import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnChanges {
  @Input() columnHeaders: string[] = [];
  @Input() data: any[] = [];
  @Input() selectedRow: any = null;
  @Output() rowClick = new EventEmitter<any>();
  dataKeys: string[] = [];

  ngOnChanges() {
    if (this.data.length > 0) {
      this.dataKeys = Object.keys(this.data[0]);
    }
  }

  onRowClick(row: any) {
    this.rowClick.emit(row);
  }

  isRowSelected(row: any): boolean {
    if (!this.selectedRow || !row) return false;
    return row.userId === this.selectedRow.userId;
  }
}
