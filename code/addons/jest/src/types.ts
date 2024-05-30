interface FailureMessage {
  line: number;
  column: number;
}

interface AssertionResult {
  ancestorTitles: string[];
  fullName: string;
  status: 'passed' | 'failed' | 'pending';
  title: string;
  duration: number;
  failureMessages: string[];
  location?: FailureMessage;
}

interface TestResult {
  assertionResults: AssertionResult[];
  startTime: number;
  endTime: number;
  status: 'passed' | 'failed' | 'pending';
  message: string;
  name: string;
}

export interface TestReport {
  numTotalTestSuites: number;
  numPassedTestSuites: number;
  numFailedTestSuites: number;
  numPendingTestSuites: number;
  numTotalTests: number;
  numPassedTests: number;
  numFailedTests: number;
  numPendingTests: number;
  numTodoTests: number;
  startTime: number;
  success: boolean;
  testResults: TestResult[];
}
