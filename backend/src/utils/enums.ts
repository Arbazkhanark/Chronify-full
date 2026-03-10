export enum GoalType {
  SHORT_TERM,
  LONG_TERM
}

export enum Priority {
  LOW,
  MEDIUM,
  HIGH
}

export enum TimeTableSource {
  MANUAL,
  AI
}

export enum AIIntent {
  DOUBT,
  TIMETABLE,
  MOTIVATION
}

export enum AccountType {
  STUDENT,
  MENTOR
}

export enum FriendRequestStatus {
  PENDING,
  ACCEPTED,
  REJECTED
}

export enum PostType {
  ACHIEVEMENT,
  JOURNEY,
  MILESTONE,
  GENERAL
}



export enum TaskStatus {
  PENDING ,    // task bana hai par start nahi hua
  ONGOING  ,   // abhi chal raha hai
  COMPLETED ,  // successfully done
  MISSED  ,    // time nikal gaya, nahi hua
  SKIPPED,
  DELAYED,
  RESCHEDULED
}



export enum GoalStatus {
  NOT_STARTED,
  IN_PROGRESS,
  COMPLETED,
  FAILED
}



export enum SessionStatus {
  STARTED,
  COMPLETED,
  ABANDONED
}
