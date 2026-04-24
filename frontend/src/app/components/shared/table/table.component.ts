import {
  Component,
  Input,
  ContentChild,
  TemplateRef,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../translate.pipe';

export interface TableColumn {
  key: string;
  label: string;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() isLoading = false;

  // Pagination inputs
  @Input() totalElements = 0;
  @Input() currentPage = 0;
  @Input() pageSize = 10;
  @Input() pageSizeOptions = [5, 10, 20, 50, 100];

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  @ContentChild('cellTemplate') cellTemplate?: TemplateRef<any>;

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalElements / this.pageSize));
  }

  get pageNumbers(): number[] {
    // Basic pagination logic, could be enhanced to show ellipsis
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }

  onSizeChange(event: Event): void {
    const size = +(event.target as HTMLSelectElement).value;
    this.pageSizeChange.emit(size);
  }
}
