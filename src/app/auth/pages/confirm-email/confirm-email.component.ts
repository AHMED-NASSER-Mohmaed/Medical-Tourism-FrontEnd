import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../../../shared/services/loading.service'

@Component({
  selector   : 'app-confirm-email',
  standalone : false,
  templateUrl: './confirm-email.component.html'
})
export class ConfirmEmailComponent implements OnInit, OnDestroy {
  pending = true;
  private sub?: Subscription;

  constructor(
    private ar   : ActivatedRoute,
    private auth : AuthService,
    private r    : Router,
    private loadingService:LoadingService
  ) {}

ngOnInit() {
  this.loadingService.show();
  this.sub = this.ar.queryParams.subscribe(({ userId, token, newEmail }) => {
    if (!userId || !token) {
      this.loadingService.hide();
      this.error('Invalid link');
      return;
    }

    const obs = newEmail
      ? this.auth.confirmNewEmail(userId, newEmail, token)
      : this.auth.confirmEmail(userId, token);

    obs.pipe(finalize(() => this.pending = false)).subscribe({
      next : () =>{
        this.loadingService.hide();
        this.ok(newEmail)},
      error: e => {
        this.loadingService.hide();
        this.error(e?.error?.message ?? 'Token invalid / expired')},
    });
  });
}

private ok(isNew = false) {
  const title = isNew ? 'New Email confirmed 🎉' : 'Email confirmed 🎉';
  Swal.fire({ icon:'success', title, confirmButtonText:'Login' })
      .then(() => this.r.navigate(['/auth/login']));
}


  private error(msg: string) {
    Swal.fire({ icon:'error', title:'Confirmation failed', text: msg, confirmButtonText:'Back' })
        .then(() => this.r.navigate(['/']));
  }

  ngOnDestroy() { this.sub?.unsubscribe(); }
}

