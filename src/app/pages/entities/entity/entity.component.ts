import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Entity } from '../models/entity.model';
import { EntityService } from '../services/entity.service';
import { formatDistance } from 'date-fns';

@Component({
  selector: 'app-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.scss'],
})
export class EntityComponent implements OnInit {
  id: any;
  private _unsubscribeAll = new Subject<null>();

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private _entityService: EntityService,
    private router: Router
  ) {}

  entityForm!: FormGroup;

  commentForm!: FormGroup;
  editable = true;
  loading = false;
  entity: Entity = {
    name: '',
    email: '',
    website: '',
    phone: '',
    address: '',
    comments: [],
  };

  ngOnInit(): void {
    this.entityForm = this.fb.group(
      {
        name: [
          null,
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
          ],
        ],
        email: [
          null,
          [
            Validators.email,
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(50),
          ],
        ],
        website: [
          null,
          [
            Validators.pattern(
              '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?'
            ),
            Validators.maxLength(50),
          ],
        ],
        phone: [
          null,
          [Validators.pattern('[- +()0-9]+'), Validators.maxLength(50)],
        ],
        address: [null, [, Validators.maxLength(50)]],
      },
      { updateOn: 'blur' }
    );

    this.commentForm = this.fb.group(
      {
        commentText: [
          null,
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(500),
          ],
        ],
      },
      { updateOn: 'blur' }
    );

    this.id = this.route.snapshot.paramMap.get('id');
    if (!!this.id) {
      this.populateForm();
    } else {
      this.editable = true;
    }
  }

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  populateForm() {
    this.loading = true;
    this._entityService
      .getEntity(this.id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (entity) => {
          this.entity = entity;

          this.updateCommentDisplayTimes();

          this.entityForm.patchValue({
            name: entity.name,
            address: entity.address,
            email: entity.email,
            phone: entity.phone,
            website: entity.website,
          });

          this.entityForm.disable();
          this.editable = false;
          this.loading = false;
        },
        (error) => {
          console.log(error);
          //TODO: show error
          this.loading = false;
        }
      );
  }

  resetForm() {
    this.entityForm.patchValue({
      name: '',
      phone: '',
      email: '',
      address: '',
      website: '',
    });
  }

  submitForm(): void {
    for (const i in this.entityForm.controls) {
      if (this.entityForm.controls.hasOwnProperty(i)) {
        this.entityForm.controls[i].markAsDirty();
        this.entityForm.controls[i].updateValueAndValidity();
      }
    }

    if (this.entityForm.valid) {
      this.loading = true;
      let entity: any = {
        name: this.entityForm.get('name')?.value,
        address: this.entityForm.get('address')?.value,
        email: this.entityForm.get('email')?.value,
        phone: this.entityForm.get('phone')?.value,
        website: this.entityForm.get('website')?.value,
      };

      let save$: Observable<any>;

      if (!!this.entity?._id) {
        entity.comments = this.entity.comments;
        entity._id = this.entity._id;
        save$ = this._entityService.editEntity(entity);
      } else {
        save$ = this._entityService.addEntity(entity);
      }

      save$.pipe(takeUntil(this._unsubscribeAll)).subscribe(
        (entity) => {
          this.entity = entity;
          this.editable = false;
          this.entityForm.disable();
          this.router.navigate([`/entity/${entity._id}`]);
          this.loading = false;
        },
        (error) => {
          console.log(error);
          //TODO: show error
          this.loading = false;
        }
      );
    }
  }

  makeEditable() {
    this.editable = true;
    this.entityForm.enable();
  }

  /**
   * Comment
   */
  loadingComments = false;
  user = {
    author: 'Username',
    avatar: 'https://lorempixel.com/100/100/people/',
  };
  commentText = '';

  submitComment(): void {
    for (const i in this.commentForm.controls) {
      if (this.commentForm.controls.hasOwnProperty(i)) {
        this.commentForm.controls[i].markAsDirty();
        this.commentForm.controls[i].updateValueAndValidity();
      }
    }

    if (this.commentForm.valid) {
      this.loadingComments = true;
      const content = this.commentForm.get('commentText')?.value;
      this.commentText = '';

      const comment = {
        author: this.user.author,
        avatar: this.user.avatar,
        content: content,
        displayTime: formatDistance(new Date(), new Date()),
        datetime: new Date(),
      };
      this._entityService
        .addComment(this.id, comment)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(
          (entity) => {
            this.loadingComments = false;
            this.entity = entity;
            this.updateCommentDisplayTimes();
          },
          (error) => {
            this.loadingComments = false;
            console.log(error);
          }
        );
    }
  }

  updateCommentDisplayTimes() {
    this.entity.comments = this.entity.comments.map((comment) => {
      return {
        ...comment,
        displayTime: formatDistance(new Date(), new Date(comment.datetime)),
      };
    });
  }
}
