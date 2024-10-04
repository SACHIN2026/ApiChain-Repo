# API Chaining Dashboard

This project is a React-based dashboard for chaining multiple API calls in a workflow.

## Setup Instructions

1. Ensure you have Node.js and npm installed on your system.
2. Clone this repository to your local machine.
3. Navigate to the project directory in your terminal.
4. Run `npm install` to install the required dependencies.
5. Start the development server with `npm run dev`.

### Prerequisites
- Node.js (v14 or above)
- Yarn or npm

## Approach

The API Chaining Dashboard is built using React and leverages the following key concepts:

1. **State Management**: Uses React's `useState` hook to manage the workflow state.
2. **Dynamic Form Generation**: Allows users to add, edit, and remove API call steps dynamically.
3. **Asynchronous Operations**: Implements asynchronous API calls using `fetch` and handles responses and errors.
4. **Data Chaining**: Supports using data from previous API responses in subsequent calls.
5. **UI Components**: Utilizes custom UI components for a consistent and responsive design.

## Assumptions and Decisions

1. The dashboard assumes that the APIs being called accept and return JSON data.
2. Error handling is implemented at each step, allowing the workflow to continue until an error occurs.
3. The UI is designed to be responsive, adapting to different screen sizes.
4. The project uses the `shadcn/ui` component library for UI elements.
5. The dashboard supports `GET`, `POST`, and a special `GET_COMMENTS` request type for demonstration purposes.

## Completed Features

1. Dynamic addition and removal of API call steps.
2. Support for GET and POST requests.
3. Special handling for fetching comments by post ID.
4. Ability to use data from previous API responses in subsequent calls.
5. Real-time display of API responses and errors.
6. Execution of the entire workflow with a single button click.
7. Responsive design for various screen sizes.

## Known Issues

1. The dashboard currently doesn't support other HTTP methods like PUT, DELETE, etc.
2. There's no persistence of workflows - data is lost on page refresh.
3. The error handling could be more robust, providing more detailed error messages and recovery options.
4. The UI might benefit from additional features like drag-and-drop reordering of steps.
5. There's no authentication mechanism for API calls that might require it.

## Future Enhancements

1. Implement workflow saving and loading functionality.
2. Add support for more HTTP methods.
3. Enhance error handling and provide more detailed feedback.
4. Implement drag-and-drop functionality for reordering workflow steps.
5. Add support for authentication methods (e.g., API keys, OAuth).
6. Implement data visualization for API responses.
