import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntitiesRoutingModule } from './entities-routing.module';
import { SearchComponent } from './search/search.component';
import { EntityComponent } from './entity/entity.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';

@NgModule({
  declarations: [SearchComponent, EntityComponent],
  exports: [SearchComponent],
  imports: [
    CommonModule,
    EntitiesRoutingModule,
    NzButtonModule,
    NzFormModule,
    NzTableModule,
    NzSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NzInputModule,
    NzSpinModule,
    NzAutocompleteModule,
    NzCommentModule,
    NzAvatarModule,
    NzListModule,
    NzPageHeaderModule,
    NzIconModule,
    NzDividerModule,
  ],
})
export class EntitiesModule {}
