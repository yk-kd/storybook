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

// {
//   "numTotalTestSuites": 2,
//   "numPassedTestSuites": 2,
//   "numFailedTestSuites": 0,
//   "numPendingTestSuites": 0,
//   "numTotalTests": 9,
//   "numPassedTests": 8,
//   "numFailedTests": 1,
//   "numPendingTests": 0,
//   "numTodoTests": 0,
//   "startTime": 1717072304742,
//   "success": false,
//   "testResults": [
//     {
//       "assertionResults": [
//         {
//           "ancestorTitles": [
//             "",
//             "Button"
//           ],
//           "fullName": " Button CSF2Secondary",
//           "status": "passed",
//           "title": "CSF2Secondary",
//           "duration": 11,
//           "failureMessages": []
//         },
//         {
//           "ancestorTitles": [
//             "",
//             "Button"
//           ],
//           "fullName": " Button CSF2StoryWithLocale",
//           "status": "passed",
//           "title": "CSF2StoryWithLocale",
//           "duration": 1,
//           "failureMessages": []
//         },
//         {
//           "ancestorTitles": [
//             "",
//             "Button"
//           ],
//           "fullName": " Button CSF2StoryWithParamsAndDecorator",
//           "status": "passed",
//           "title": "CSF2StoryWithParamsAndDecorator",
//           "duration": 1,
//           "failureMessages": []
//         },
//         {
//           "ancestorTitles": [
//             "",
//             "Button"
//           ],
//           "fullName": " Button CSF3Primary",
//           "status": "passed",
//           "title": "CSF3Primary",
//           "duration": 2,
//           "failureMessages": []
//         },
//         {
//           "ancestorTitles": [
//             "",
//             "Button"
//           ],
//           "fullName": " Button CSF3Button",
//           "status": "passed",
//           "title": "CSF3Button",
//           "duration": 1,
//           "failureMessages": []
//         },
//         {
//           "ancestorTitles": [
//             "",
//             "Button"
//           ],
//           "fullName": " Button CSF3ButtonWithRender",
//           "status": "passed",
//           "title": "CSF3ButtonWithRender",
//           "duration": 2,
//           "failureMessages": []
//         },
//         {
//           "ancestorTitles": [
//             "",
//             "Button"
//           ],
//           "fullName": " Button CSF3InputFieldFilled",
//           "status": "failed",
//           "title": "CSF3InputFieldFilled",
//           "duration": 137,
//           "failureMessages": [
//             "expect(element).not.toHaveValue(Hello world!)\n\nExpected the element not to have value:\n  Hello world!\nReceived:\n  Hello world!"
//           ],
//           "location": {
//             "line": 24942,
//             "column": 17
//           }
//         },
//         {
//           "ancestorTitles": [
//             "",
//             "Button"
//           ],
//           "fullName": " Button WithLoader",
//           "status": "passed",
//           "title": "WithLoader",
//           "duration": 3,
//           "failureMessages": []
//         },
//         {
//           "ancestorTitles": [
//             "",
//             "Button"
//           ],
//           "fullName": " Button Modal",
//           "status": "passed",
//           "title": "Modal",
//           "duration": 19,
//           "failureMessages": []
//         }
//       ],
//       "startTime": 1717072305696,
//       "endTime": 1717072305873,
//       "status": "failed",
//       "message": "",
//       "name": "/Users/yannbraga/open-source/storybook/test-storybooks/portable-stories-kitchen-sink/react/stories/Button.stories.tsx"
//     }
//   ]
// }
