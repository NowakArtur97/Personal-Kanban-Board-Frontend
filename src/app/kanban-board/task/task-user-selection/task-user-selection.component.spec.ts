import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskUserSelectionComponent } from './task-user-selection.component';

describe('TaskUserSelectionComponent', () => {
  let component: TaskUserSelectionComponent;
  let fixture: ComponentFixture<TaskUserSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskUserSelectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaskUserSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
