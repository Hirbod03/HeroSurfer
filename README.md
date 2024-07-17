# HeroSurfer Chrome Extension

**Hero Surfer** is a superhero-themed Chrome extension designed to help you manage your tasks with priority-based background colors. This project was developed as an exercise in creating Chrome extensions and is not intended for publication.

## Features

- **Superhero Themed Interface**: Choose from a selection of superhero headers.
- **Task Management**: Add, delete, and mark tasks as done.
- **Priority-Based Background Colors**: Indicate task priority with background colors (High: Red, Medium: Yellow, Low: Green).
- **Keyboard Shortcuts**: Add tasks quickly using the enter key.

## Setup

Follow these steps to set up the extension locally on your Chrome browser:

1. **Clone or download this repository** to your local machine.

2. **Open Chrome and navigate to the Extensions page**:
   - Enter `chrome://extensions/` in the address bar.

3. **Enable Developer Mode**:
   - Toggle the switch in the upper-right corner to enable Developer Mode.

4. **Load the unpacked extension**:
   - Click the "Load unpacked" button.
   - Select the directory where you downloaded the repository.

5. **The Hero Surfer extension should now be installed** and visible in your extensions toolbar.

## Files

- **manifest.json**: Defines the extension's properties and permissions.
- **popup.html**: The main HTML file for the extension's popup interface.
- **popup.js**: Contains the JavaScript logic for managing tasks and handling events.
- **styles.css**: Contains the styles for the popup interface.

## Usage

1. **Open the extension** by clicking the Hero Surfer icon in the extensions toolbar.
2. **Select a superhero header** from the dropdown menu.
3. **Add a new task**:
   - Enter the task description in the input field.
   - Select the priority from the dropdown menu.
   - Click the "Add" button or press the "Enter" key.
4. **Manage tasks**:
   - Click on the task description to mark it as done.
   - Click the "X" button to delete the task.
