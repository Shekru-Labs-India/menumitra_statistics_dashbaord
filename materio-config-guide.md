READ THESE LINKS AND WRITE DOWN THE CONTEXT OF THE LINK NAME IT PROPERLY MAKE IT IN PROFESSIONAL FORMAT OF DOCUMENTATION 
BECAUSE WE ARE PORTING THIS HTML,CSS & JS INTO REACT.JS SO MAKE SURE ALSO CONSIST THE CONTEXT HOW WE CAN PORT THIS HTML, CSS & JS FOR REACT.JS! 

@https://demos.themeselection.com/materio-bootstrap-html-admin-template/documentation/
@https://demos.themeselection.com/materio-bootstrap-html-admin-template/documentation/customization-sass.html 
@https://demos.themeselection.com/materio-bootstrap-html-admin-template/documentation/customization-js.html 
@https://demos.themeselection.com/materio-bootstrap-html-admin-template/documentation/faq.html 
@https://demos.themeselection.com/materio-bootstrap-html-admin-template/documentation/layouts.html 
@https://demos.themeselection.com/materio-bootstrap-html-admin-template/documentation/folder-structure.html 

# Materio Bootstrap HTML Admin Template Documentation

## Introduction to Materio
**Source: [@https://demos.themeselection.com/materio-bootstrap-html-admin-template/documentation/](https://demos.themeselection.com/materio-bootstrap-html-admin-template/documentation/)**

Materio is a developer-friendly, highly customizable, and carefully crafted Bootstrap 5 Admin Dashboard Template designed with Material Design principles. This documentation provides guidance on understanding the template and how to port it from HTML/CSS/JS to React.js.

### Key Features
- Material Design-based UI components
- Responsive layout system that works across devices
- Comprehensive UI component library with over 100+ components
- Extensive utility classes for rapid development
- Customizable theme settings with light/dark mode support
- Multiple layout options (vertical, horizontal, without menu)
- RTL (Right-to-Left) support
- Built-in dark theme
- Interactive dashboard with widgets and charts

### Core Components to Port

When migrating to React, pay special attention to these key components:

1. **Layout Components**:
   - Navbar (with notifications, user dropdown, and language selector)
   - Sidebar/Menu (collapsible menu with various states)
   - Footer (customizable with links)
   - Content wrapper (with breadcrumb navigation)

2. **UI Components**:
   - Cards (with various actions, headers, and content styles)
   - Buttons (with states, sizes, and variants)
   - Form elements (inputs, selectors, checkboxes with Material Design styling)
   - Tables (with sorting, filtering capabilities)
   - Modals and dialogs
   - Alerts and notifications
   - Badges and labels
   - Progress indicators
   - Tabs and accordions

3. **Extended UI Features**:
   - Sweet Alert customizations
   - Toasts notifications
   - Avatar handling
   - Media player components
   - Perfect scrollbar integration
   - Timeline displays
   - Tour guide functionality

4. **JavaScript Utilities**:
   - Template customizer (theme settings)
   - Layout handlers (menu collapse, expansion)
   - RTL switching
   - Theme mode toggling
   - Helper functions for DOM manipulation

### Built-in Pages to Convert

The template includes several pre-built pages that should be converted to React components:

1. **Authentication Pages**:
   - Login
   - Register
   - Forgot Password
   - Two-factor Authentication

2. **User Management**:
   - User List
   - User Details
   - Account Settings

3. **Common Application Pages**:
   - Dashboard (with analytics charts)
   - Calendar
   - Kanban Board
   - Email Application
   - Chat Interface
   - Invoice Management
   - Error Pages (404, 500, etc.)

### Built-in Functionalities

The template comes with several built-in functionalities that need special handling when porting to React:

1. **Template Customizer**:
   - In React, implement this using Context API or Redux
   - Store user preferences in localStorage or a backend
   - Handle theme changes with React state

2. **Menu Handling**:
   - Replace jQuery-based menu handlers with React state management
   - Use React Router for navigation
   - Implement active state management for menu items

3. **Data Visualization**:
   - Replace static chart implementations with React chart libraries
   - Use React-specific libraries like recharts, react-chartjs-2, or react-apexcharts
   - Implement data fetching with React hooks

4. **Form Handling**:
   - Replace native form validation with React form libraries (Formik, React Hook Form)
   - Implement form state management with React hooks
   - Convert input masks and validators to React components

### Porting to React.js - Overview

When migrating the Materio Bootstrap HTML template to React.js, follow these recommended steps:

1. **Understand Component Structure**: 
   - Break down the HTML/CSS/JS structure into logical React components
   - Identify reusable UI elements that can be converted to components
   - Map the DOM structure to React component hierarchy

2. **Set Up React Project**: 
   - Create a React application using Create React App or Next.js
   - Configure SASS/SCSS support for styling
   - Set up folder structure to organize components, layouts, and pages

3. **Bootstrap Integration Options**:
   - Use React-Bootstrap for component-based approach (recommended)
   - Alternatively, use reactstrap for Bootstrap components
   - Configure Bootstrap SCSS to maintain theming capabilities

4. **Convert JavaScript Functionality**:
   - Replace jQuery code with React hooks and state management
   - Transform event listeners to React event handlers
   - Convert template customizer to React context/hooks

5. **Asset Management**:
   - Move fonts, images, and icons to public or assets directory
   - Update references in components
   - Handle static assets properly with React's import system

### React Project Structure Recommendation

```
materio-react/
├── public/
│   ├── assets/
│   │   ├── fonts/ 
│   │   ├── images/
│   │   └── icons/
├── src/
│   ├── components/
│   │   ├── ui/ (Basic UI components)
│   │   ├── layout/ (Layout components)
│   │   └── extended/ (Extended UI components)
│   ├── contexts/ 
│   │   ├── ThemeContext.js (Theme management)
│   │   └── AuthContext.js (Authentication)
│   ├── hooks/ (Custom React hooks)
│   ├── layouts/ (Page layouts)
│   ├── pages/ (Page components)
│   ├── scss/ (SCSS files)
│   │   ├── base/
│   │   ├── components/ 
│   │   ├── theme/
│   │   └── main.scss
│   ├── utils/ (Helper functions)
│   ├── App.js
│   └── index.js
└── package.json
```

### Implementation Strategy

1. **Start with Core Layout Components**:
   - Create base layout components (Navbar, Sidebar, Footer, Content area)
   - Implement responsive behavior with React state and CSS media queries
   - Set up routing structure using React Router

2. **Implement UI Components**:
   - Convert Bootstrap components to React components
   - Maintain Material Design styling and functionality
   - Create a component library that matches Materio's design system

3. **Set Up Theming System**:
   - Create a ThemeContext to manage theme settings
   - Implement theme customizer component
   - Support light/dark mode and color scheme customization
   - Handle RTL/LTR text direction

4. **Port JavaScript Functionality**:
   - Replace menu toggle behavior with React state
   - Implement scroll behaviors using React hooks
   - Create custom hooks for reusable functionality

5. **Data Management**:
   - Set up state management for application data
   - Create services for API communication
   - Implement authentication and authorization

By following this approach, you can successfully port the Materio Bootstrap HTML template to a clean, maintainable React application while preserving its design and functionality. 

## SASS Customization
**Source: [@https://demos.themeselection.com/materio-bootstrap-html-admin-template/documentation/customization-sass.html](https://demos.themeselection.com/materio-bootstrap-html-admin-template/documentation/customization-sass.html)**

The Materio template uses SASS (SCSS) for styling, providing a powerful way to customize the appearance of the template through variables and mixins. When porting to React.js, you can maintain this SASS structure for consistent theming.

### SASS Architecture in React

When migrating the SASS structure to React:

1. **Preserve the SASS Folder Structure**:
   ```
   src/
   ├── scss/
   │   ├── _bootstrap-extended/ (Bootstrap overrides)
   │   ├── _custom-variables/ (Custom SCSS variables)
   │   ├── _theme/ (Theme variables and mixins)
   │   ├── core.scss (Core styles)
   │   ├── theme-default.scss (Default theme)
   │   └── theme-bordered.scss (Bordered theme variation)
   ```

2. **Configure SASS Processing**:
   - If using Create React App, SASS is supported out of the box
   - For Next.js, install `sass` package and import the styles
   - Configure the build process to generate CSS from SCSS files

### Key Customization Files

1. **_custom-variables/theme-variables.scss**:
   - Contains theme colors, typography, and spacing variables
   - When porting to React, maintain this file for consistent theming
   - Example React implementation:

   ```jsx
   // In ThemeContext.js
   import { createContext, useState } from 'react';

   export const ThemeContext = createContext();

   export const ThemeProvider = ({ children }) => {
     const [theme, setTheme] = useState({
       primary: '#696cff', // Materio default primary color
       secondary: '#8592a3',
       success: '#71dd37',
       info: '#03c3ec',
       warning: '#ffab00',
       danger: '#ff3e1d',
       dark: '#233446',
       light: '#f9fafb',
       background: '#f5f5f9',
     });

     return (
       <ThemeContext.Provider value={{ theme, setTheme }}>
         {children}
       </ThemeContext.Provider>
     );
   };
   ```

2. **_theme/common.scss**:
   - Contains common mixins and functions
   - Port these as JavaScript utilities or CSS-in-JS functions in React

3. **_bootstrap-extended/**:
   - Contains Bootstrap component overrides
   - In React, these can be handled by:
     - Using styled-components or emotion to style React Bootstrap components
     - Creating custom component wrappers with overridden styles
     - Using SCSS modules for component-specific styling

### Implementation in React

1. **Using CSS Modules**:
   ```jsx
   // Button.module.scss
   .btn {
     @import 'src/scss/core/variables';
     padding: $btn-padding-y $btn-padding-x;
     border-radius: $btn-border-radius;
     // other styles from Materio
   }

   // Button.jsx
   import styles from './Button.module.scss';
   
   const Button = ({ children, variant = 'primary' }) => {
     return (
       <button className={`${styles.btn} ${styles[`btn-${variant}`]}`}>
         {children}
       </button>
     );
   };
   ```

2. **Using Styled Components**:
   ```jsx
   // Button.jsx with styled-components
   import styled from 'styled-components';
   
   const StyledButton = styled.button`
     padding: ${props => props.theme.buttonPadding};
     border-radius: ${props => props.theme.borderRadius};
     background-color: ${props => props.theme[props.variant || 'primary']};
     // other styles from Materio
   `;
   
   const Button = (props) => {
     return <StyledButton {...props} />;
   };
   ```

3. **Dynamic Theming**:
   ```jsx
   // Theme toggler component
   import { useContext } from 'react';
   import { ThemeContext } from '../context/ThemeContext';
   
   const ThemeToggler = () => {
     const { theme, setTheme } = useContext(ThemeContext);
     
     const toggleTheme = () => {
       setTheme(theme.mode === 'light' 
         ? { ...theme, mode: 'dark', background: '#2b2c40' }
         : { ...theme, mode: 'light', background: '#f5f5f9' }
       );
     };
     
     return (
       <button onClick={toggleTheme}>
         Toggle {theme.mode === 'light' ? 'Dark' : 'Light'} Mode
       </button>
     );
   };
   ```

### SASS Variables to CSS Variables

For dynamic theme switching in React:

1. **Convert SASS variables to CSS custom properties**:
   ```scss
   :root {
     --primary: #{$primary};
     --secondary: #{$secondary};
     // other variables
   }
   ```

2. **Update CSS variables in JavaScript**:
   ```jsx
   const applyTheme = (theme) => {
     document.documentElement.style.setProperty('--primary', theme.primary);
     document.documentElement.style.setProperty('--secondary', theme.secondary);
     // other variables
   };
   ```

3. **Use CSS variables in components**:
   ```jsx
   const PrimaryButton = styled.button`
     background-color: var(--primary);
     color: white;
     // other styles
   `;
   ```

By using this approach, you can retain the powerful theming capabilities of Materio's SASS system while adapting it to React's component model, allowing for both static styling and dynamic theme changes.

## JavaScript Customization
**Source: [@https://demos.themeselection.com/materio-bootstrap-html-admin-template/documentation/customization-js.html](https://demos.themeselection.com/materio-bootstrap-html-admin-template/documentation/customization-js.html)**

Materio template includes various JavaScript functionality for UI interactions, layout management, and component initialization. When porting to React, these JavaScript functions need to be converted to React hooks, components, and event handlers.

### Core JavaScript Modules

The template's JavaScript structure includes several modules that need to be transformed when porting to React:

1. **Template Customizer**:
   - Controls theme settings, layout options, and appearance
   - Manages user preferences and applies them to the UI

2. **Menu Handler**:
   - Controls menu expansion, collapse, and active states
   - Handles responsive behavior for mobile devices

3. **Layout Handler**:
   - Manages layout options (fixed/fluid navbar, footer)
   - Handles container sizes and responsive breakpoints

4. **Utility Functions**:
   - Helper methods for common operations
   - DOM manipulation utilities

### Converting to React Patterns

#### 1. Replace jQuery DOM Manipulation with React State

Original jQuery code:
```javascript
// Original jQuery code
$('.menu-toggle').on('click', function() {
  $('body').toggleClass('menu-collapsed');
});
```

React implementation:
```jsx
// React implementation
import { useState } from 'react';

function Layout() {
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuCollapsed(!isMenuCollapsed);
  };
  
  return (
    <div className={`app-layout ${isMenuCollapsed ? 'menu-collapsed' : ''}`}>
      <button className="menu-toggle" onClick={toggleMenu}>
        Toggle Menu
      </button>
      {/* Rest of layout */}
    </div>
  );
}
```

#### 2. Create Custom Hooks for Reusable Logic

Original JavaScript:
```javascript
// Original JavaScript module
const Helpers = {
  initNavbarDropdowns: function() {
    // Logic to initialize dropdowns
  },
  setFullScreen: function(element) {
    // Full screen logic
  }
};
```

React custom hooks:
```jsx
// React custom hooks
import { useState, useCallback } from 'react';

// Dropdown hook
function useNavbarDropdowns() {
  const [openDropdown, setOpenDropdown] = useState(null);
  
  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };
  
  return { openDropdown, toggleDropdown };
}

// Full screen hook
function useFullScreen() {
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  const toggleFullScreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  }, []);
  
  return { isFullScreen, toggleFullScreen };
}
```

#### 3. Template Customizer as React Context

Original JavaScript:
```javascript
// Original JavaScript
const TemplateCustomizer = function() {
  this.settings = {
    theme: 'light',
    layout: 'vertical',
    navbarFixed: true,
    footerFixed: false,
  };
  
  this.setTheme = function(theme) {
    this.settings.theme = theme;
    // Apply theme
  };
};
```

React Context implementation:
```jsx
// React Context
import { createContext, useContext, useState, useEffect } from 'react';

// Create context
const CustomizerContext = createContext();

// Provider component
export function CustomizerProvider({ children }) {
  const [settings, setSettings] = useState({
    theme: 'light',
    layout: 'vertical',
    navbarFixed: true,
    footerFixed: false,
  });
  
  // Function to update settings
  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    // Store in localStorage for persistence
    localStorage.setItem('materioSettings', JSON.stringify({ 
      ...settings, 
      ...newSettings 
    }));
  };
  
  // Load settings from localStorage on init
  useEffect(() => {
    const savedSettings = localStorage.getItem('materioSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);
  
  // Apply settings to DOM
  useEffect(() => {
    // Apply theme
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${settings.theme}-theme`);
    
    // Apply layout
    document.body.classList.remove('vertical-layout', 'horizontal-layout');
    document.body.classList.add(`${settings.layout}-layout`);
    
    // Apply fixed settings
    document.body.classList.toggle('navbar-fixed', settings.navbarFixed);
    document.body.classList.toggle('footer-fixed', settings.footerFixed);
  }, [settings]);
  
  return (
    <CustomizerContext.Provider value={{ settings, updateSettings }}>
      {children}
    </CustomizerContext.Provider>
  );
}

// Custom hook for using the context
export function useCustomizer() {
  return useContext(CustomizerContext);
}
```

#### 4. Convert Event Listeners to React Events

Original JavaScript:
```javascript
// Original JavaScript
document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('.search-toggle').addEventListener('click', function() {
    document.querySelector('.search-input').focus();
  });
});
```

React implementation:
```jsx
// React implementation
import { useRef } from 'react';

function SearchBar() {
  const searchInputRef = useRef(null);
  
  const handleSearchToggle = () => {
    searchInputRef.current.focus();
  };
  
  return (
    <div className="search-wrapper">
      <button className="search-toggle" onClick={handleSearchToggle}>
        <i className="search-icon"></i>
      </button>
      <input 
        ref={searchInputRef} 
        className="search-input" 
        type="text" 
        placeholder="Search..."
      />
    </div>
  );
}
```

### Handling Third-Party Plugins

Materio uses several third-party plugins that need to be handled differently in React:

1. **Chart Libraries**:
   - Replace Chart.js with react-chartjs-2
   - Replace ApexCharts with react-apexcharts
   - Initialize charts as React components instead of manual initialization

2. **Form Plugins**:
   - Replace form validation plugins with React form libraries (Formik, React Hook Form)
   - Use React-specific date picker components
   - Replace select2 with React-Select

3. **Data Tables**:
   - Replace jQuery DataTables with React Table or Material-UI DataGrid
   - Implement sorting, filtering, and pagination with React state

### Example: Implementing Theme Toggler in React

```jsx
import { useCustomizer } from '../contexts/CustomizerContext';

function ThemeToggler() {
  const { settings, updateSettings } = useCustomizer();
  
  const handleThemeChange = () => {
    updateSettings({ theme: settings.theme === 'light' ? 'dark' : 'light' });
  };
  
  return (
    <div className="theme-toggle">
      <button 
        className={`toggle-btn ${settings.theme === 'dark' ? 'active' : ''}`}
        onClick={handleThemeChange}
      >
        <span className="toggle-icon">
          {settings.theme === 'light' ? '🌙' : '☀️'}
        </span>
        {settings.theme === 'light' ? 'Dark Mode' : 'Light Mode'}
      </button>
    </div>
  );
}
```

### Best Practices for Porting JavaScript to React

1. **Replace imperative code with declarative React patterns**:
   - Use state and props to drive UI changes
   - Avoid direct DOM manipulation

2. **Use useEffect for side effects**:
   - Replace document.ready handlers with useEffect
   - Handle cleanup in useEffect return function

3. **Create custom hooks for reusable logic**:
   - Extract complex functionality into custom hooks
   - Keep components focused on rendering

4. **Use React's event system**:
   - Replace addEventListener with React's synthetic events
   - Leverage event delegation through React's event system

5. **Implement Context API for global state**:
   - Use for theme, authentication, and application settings
   - Replace global variables with Context

By following these patterns, you can effectively transform Materio's JavaScript functionality into React's component model, maintaining the template's interactive features while gaining the benefits of React's declarative approach.