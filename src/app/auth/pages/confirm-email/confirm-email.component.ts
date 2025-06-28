import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector   : 'app-confirm-email',
  standalone : false,
  template   : '<p class="text-center mt-5" *ngIf="pending">⏳ Validating link…</p>',
})
export class ConfirmEmailComponent implements OnInit, OnDestroy {
  pending = true;
  private sub?: Subscription;

  constructor(
    private ar   : ActivatedRoute,
    private auth : AuthService,
    private r    : Router
  ) {}

  ngOnInit() {
    this.sub = this.ar.queryParams.subscribe(({ userId, token }) => {
      if (!userId || !token) { this.error('Invalid link'); return; }

      this.auth.confirmEmail(userId, token)
        .pipe(finalize(() => this.pending = false))
        .subscribe({
          next : () => this.ok(),
          error: e  => this.error(e?.error?.message ?? 'Token invalid / expired'),
        });
    });
  }

  private ok() {
    Swal.fire({ icon:'success', title:'Email confirmed 🎉', confirmButtonText:'Login' })
        .then(() => this.r.navigate(['/auth/login']));
  }

  private error(msg: string) {
    Swal.fire({ icon:'error', title:'Confirmation failed', text: msg, confirmButtonText:'Back' })
        .then(() => this.r.navigate(['/']));
  }

  ngOnDestroy() { this.sub?.unsubscribe(); }
}

