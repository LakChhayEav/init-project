import { Injectable, signal } from '@angular/core';

export interface ConfirmConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  readonly config = signal<ConfirmConfig | null>(null);

  open(config: ConfirmConfig): void {
    this.config.set({
      ...config,
      confirmText: config.confirmText || 'common.confirm',
      cancelText: config.cancelText || 'common.cancel',
    });
  }

  close(): void {
    this.config.set(null);
  }

  confirm(): void {
    const current = this.config();
    if (current?.onConfirm) {
      current.onConfirm();
    }
    this.close();
  }

  cancel(): void {
    const current = this.config();
    if (current?.onCancel) {
      current.onCancel();
    }
    this.close();
  }
}
