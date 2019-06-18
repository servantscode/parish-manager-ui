import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, filter, debounceTime, switchMap } from 'rxjs/operators'

import { LoginService } from '../services/login.service';
import { MessageService } from '../services/message.service';

import { EmailService } from '../services/email.service';
import { Email } from '../email';
import { SCValidation } from '../validation';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-email-dialog',
  templateUrl: './email-dialog.component.html',
  styleUrls: ['./email-dialog.component.scss']
})
export class EmailDialogComponent implements OnInit {

  public Editor = ClassicEditor;

  form = this.fb.group({
      from: [this.loginService.getUserName(), [Validators.required, Validators.pattern(SCValidation.EMAIL)]],
      to: ['', [Validators.required, Validators.pattern(SCValidation.MULTI_EMAIL)]],
      cc: ['', Validators.pattern(SCValidation.MULTI_EMAIL)],
      replyTo: ['noreply@servantscode.org', Validators.pattern(SCValidation.EMAIL)],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });

  constructor(public dialogRef: MatDialogRef<EmailDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              public messageService: MessageService,
              public loginService: LoginService,
              public emailService: EmailService) { }

  ngOnInit() {
    if(this.data)
      this.form.patchValue(this.data);
  }

  send() {
    if(this.form.valid) {
      var value = this.form.value;
      var email: Email = {
        from: value.from,
        to: this.splitAddresses(value.to),
        cc: this.splitAddresses(value.cc),
        replyTo: value.replyTo,
        subject: value.subject,
        message: value.message
      };
      this.emailService.sendEmail(email).
        subscribe(() => {
          this.messageService.info("Email sent");
          this.dialogRef.close();
        });
    }
  }

  cancel() {
    this.dialogRef.close();    
  }

  private splitAddresses(input: string): string[] {
    if(Array.isArray(input))
      return input;
    return input.split(/[,;\s]/).map(addr => addr.trim());
  }
}
