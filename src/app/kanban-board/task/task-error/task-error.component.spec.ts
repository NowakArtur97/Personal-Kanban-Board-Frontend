import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskErrorComponent } from './task-error.component';

describe('TaskErrorComponent', () => {
  let component: TaskErrorComponent;
  let fixture: ComponentFixture<TaskErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskErrorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaskErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
