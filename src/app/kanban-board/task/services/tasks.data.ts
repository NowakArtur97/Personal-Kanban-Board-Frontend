import Subtask from "../models/subtask.model";
import TaskPriority from "../models/task-priority.model";
import { TaskStatus } from "../models/task-status.model";
import Task from "../models/task.model";

const EXAMPLE_TASK: Task = {
    id: "3e0fb254-60ad-4614-8972-f783e4f62170",
    userId: "3e0fb254-60ad-4614-8972-f783e4f62170",
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ",
    description: "Aliquam nunc mi, faucibus et justo et, rhoncus finibus ipsum. Aliquam iaculis tempor felis, sit amet rhoncus magna interdum in. Maecenas finibus ut mauris ornare tristique. Donec urna erat, vulputate a ante nec, fringilla porta diam. Morbi eleifend mi nec tortor vestibulum pretium. Donec imperdiet vestibulum vulputate. Phasellus ante diam, dapibus in venenatis et, cursus eu sapien. Nulla quis tincidunt ante, eget sollicitudin lorem.",
    status: TaskStatus.InProgress,
    priority: TaskPriority.MEDIUM,
    targetEndDate: "2016-08-16T12:10:56",
    createdOn: "Tuesday, Aug 16, 2016 12:10:56 PM",
    createdBy: "Arthur Smith",
    updatedOn: "Tuesday, Aug 16, 2016 12:10:56 PM",
    updatedBy: "Andrew Smith",
    assignedTo: "Andrew Smith",
    subtasks: []
};
const EXAMPLE_SUBTASK: Subtask = {
    id: "3e0fb254-60ad-4614-8972-f783e4f62170",
    userId: "3e0fb254-60ad-4614-8972-f783e4f62170",
    taskId: "3e0fb254-60ad-4614-8972-f783e4f62170",
    title: "Curabitur malesuada scelerisque mi, sed rutrum nisi rhoncus eget.",
    description: "Donec pulvinar at arcu eget venenatis. Fusce et vestibulum odio. Ut aliquam iaculis pharetra. Integer a ipsum eleifend, sodales ex a, facilisis justo. Aliquam vehicula nec libero et gravida. Vivamus laoreet quam ac elit pulvinar, eu finibus odio mollis. Etiam mollis dolor eget feugiat convallis. Sed ac erat eget libero placerat hendrerit id semper tellus. Integer lobortis in quam id bibendum. Duis nec convallis nisl. Praesent elementum lorem felis, et efficitur diam finibus at. Quisque pulvinar dui lacus, quis rhoncus quam euismod porttitor.",
    status: TaskStatus.InProgress,
    priority: TaskPriority.MEDIUM,
    targetEndDate: "2016-08-16T12:10:56",
    createdOn: "Tuesday, Aug 16, 2016 13:10:56 PM",
    createdBy: "Arthur Smith",
    updatedOn: "Tuesday, Aug 16, 2016 13:10:56 PM",
    updatedBy: "Andrew Smith",
    assignedTo: "Andrew Smith",
};
const TEMP_TASKS: Task[] = [
    {
        ...EXAMPLE_TASK,
        title: "Lorem ipsum dolor sit amet",
        status: TaskStatus.InProgress,
        priority: TaskPriority.MEDIUM,
        subtasks: [
            {
                ...EXAMPLE_SUBTASK,
                status: TaskStatus.ReadyToStart,
                priority: TaskPriority.LOW
            },
            {
                ...EXAMPLE_SUBTASK,
                status: TaskStatus.InProgress,
                priority: TaskPriority.MEDIUM
            },
            {
                ...EXAMPLE_SUBTASK,
                status: TaskStatus.Done,
                priority: TaskPriority.HIGH
            },
        ]
    },
    {
        ...EXAMPLE_TASK,
        status: TaskStatus.ReadyToStart,
        priority: TaskPriority.LOW,
        subtasks: [
            {
                ...EXAMPLE_SUBTASK,
                status: TaskStatus.ReadyToStart,
                priority: TaskPriority.MEDIUM
            },
            {
                ...EXAMPLE_SUBTASK,
                status: TaskStatus.ReadyToStart,
                priority: TaskPriority.HIGH
            },
        ]
    },
    {
        ...EXAMPLE_TASK,
        status: TaskStatus.InProgress,
        priority: TaskPriority.MEDIUM,
        subtasks: [
            {
                ...EXAMPLE_SUBTASK,
                status: TaskStatus.ReadyToStart,
                priority: TaskPriority.LOW
            },
            {
                ...EXAMPLE_SUBTASK,
                status: TaskStatus.InProgress,
                priority: TaskPriority.HIGH
            },
        ]
    },
    {
        ...EXAMPLE_TASK,
        status: TaskStatus.InProgress,
        priority: TaskPriority.MEDIUM,
        subtasks: []
    },
    {
        ...EXAMPLE_TASK,
        status: TaskStatus.InProgress,
        priority: TaskPriority.MEDIUM,
        subtasks: []
    },
    {
        ...EXAMPLE_TASK,
        status: TaskStatus.Done,
        priority: TaskPriority.MEDIUM,
        subtasks: [
            {
                ...EXAMPLE_SUBTASK,
                status: TaskStatus.Done,
                priority: TaskPriority.HIGH
            },
            {
                ...EXAMPLE_SUBTASK,
                status: TaskStatus.Done,
                priority: TaskPriority.HIGH
            },
        ]
    },
];

export default TEMP_TASKS;