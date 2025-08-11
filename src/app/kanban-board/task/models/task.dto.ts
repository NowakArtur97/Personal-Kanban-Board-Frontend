export default interface TaskDTO {
  readonly title: string;
  readonly description: string;
  readonly status: string;
  readonly priority: string;
  readonly targetEndDate: string;
  readonly assignedTo: string;
}
