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

Materio is a developer-friendly, highly customizable, and carefully crafted Bootstrap 5 Admin Dashboard Template designed with Material Design principles. This documentation provides comprehensive guidance on understanding the template and how to port it from HTML/CSS/JS to React.js.

### Key Features

1. **Material Design Integration**:
- Material Design-based UI components
   - Consistent spacing and typography
   - Elevation and shadow effects
   - Ripple effects on interactions

2. **Responsive Layout System**:
   - Mobile-first approach
   - Breakpoint-based layouts
   - Collapsible sidebar
   - Adaptive content areas

3. **Component Library**:
   - 100+ pre-built components
   - Customizable variants
   - Consistent styling
   - Accessibility support

4. **Theme Customization**:
   - Light/dark mode support
   - Color scheme customization
   - Typography customization
   - Layout options

5. **Advanced Features**:
- RTL (Right-to-Left) support
   - Multiple layout options
   - Interactive dashboard
   - Chart integrations

### Core Components to Port

When migrating to React, pay special attention to these key components:

1. **Layout Components**:
   ```jsx
   // components/layout/Navbar.jsx
   function Navbar({ isFixed, onMenuToggle }) {
     return (
       <nav className={`navbar ${isFixed ? 'navbar-fixed' : ''}`}>
         <div className="navbar-brand">
           <img src="/logo.png" alt="Logo" />
         </div>
         <div className="navbar-content">
           <button onClick={onMenuToggle}>
             <i className="bx bx-menu"></i>
           </button>
           <div className="navbar-right">
             <NotificationDropdown />
             <UserDropdown />
             <LanguageSelector />
           </div>
         </div>
       </nav>
     );
   }
   ```

2. **UI Components**:
   ```jsx
   // components/ui/Card/index.jsx
   function Card({ title, actions, children, variant = 'default' }) {
     return (
       <div className={`card card-${variant}`}>
         {title && (
           <div className="card-header">
             <h5 className="card-title">{title}</h5>
             {actions && <div className="card-actions">{actions}</div>}
           </div>
         )}
         <div className="card-body">{children}</div>
       </div>
     );
   }
   ```

3. **Extended UI Features**:
   ```jsx
   // components/extended/Charts/LineChart.jsx
   import { Line } from 'react-chartjs-2';

   function LineChart({ data, options }) {
     return (
       <div className="chart-container">
         <Line data={data} options={options} />
       </div>
     );
   }
   ```

4. **JavaScript Utilities**:
   ```jsx
   // hooks/useTheme.js
   function useTheme() {
     const [theme, setTheme] = useState({
       mode: 'light',
       primaryColor: '#696cff',
       secondaryColor: '#8592a3',
     });

     const toggleTheme = () => {
       setTheme(prev => ({
         ...prev,
         mode: prev.mode === 'light' ? 'dark' : 'light'
       }));
     };

     return { theme, toggleTheme };
   }
   ```

### Built-in Pages to Convert

The template includes several pre-built pages that should be converted to React components:

1. **Authentication Pages**:
   ```jsx
   // pages/auth/Login.jsx
   function Login() {
     const [formData, setFormData] = useState({
       email: '',
       password: '',
     });

     const handleSubmit = async (e) => {
       e.preventDefault();
       // Handle login logic
     };

     return (
       <div className="auth-wrapper">
         <Card>
           <h2>Login</h2>
           <form onSubmit={handleSubmit}>
             <Input
               type="email"
               label="Email"
               value={formData.email}
               onChange={e => setFormData({ ...formData, email: e.target.value })}
             />
             <Input
               type="password"
               label="Password"
               value={formData.password}
               onChange={e => setFormData({ ...formData, password: e.target.value })}
             />
             <Button type="submit">Login</Button>
           </form>
         </Card>
       </div>
     );
   }
   ```

2. **User Management**:
   ```jsx
   // pages/users/UserList.jsx
   function UserList() {
     const [users, setUsers] = useState([]);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
       // Fetch users
       fetchUsers().then(data => {
         setUsers(data);
         setLoading(false);
       });
     }, []);

     return (
       <div className="users-wrapper">
         <Card title="Users">
           {loading ? (
             <LoadingSpinner />
           ) : (
             <Table
               columns={userColumns}
               data={users}
               pagination
               sorting
             />
           )}
         </Card>
       </div>
     );
   }
   ```

### Built-in Functionalities

The template comes with several built-in functionalities that need special handling when porting to React:

1. **Template Customizer**:
   ```jsx
   // contexts/CustomizerContext.jsx
   const CustomizerContext = createContext();

   export function CustomizerProvider({ children }) {
     const [settings, setSettings] = useState({
       theme: 'light',
       layout: 'vertical',
       navbarFixed: true,
       footerFixed: false,
     });

     const updateSettings = (newSettings) => {
       setSettings(prev => ({ ...prev, ...newSettings }));
       localStorage.setItem('materioSettings', JSON.stringify({
         ...settings,
         ...newSettings
       }));
     };

     return (
       <CustomizerContext.Provider value={{ settings, updateSettings }}>
         {children}
       </CustomizerContext.Provider>
     );
   }
   ```

2. **Menu Handling**:
   ```jsx
   // components/layout/Sidebar/Menu.jsx
   function Menu({ items }) {
     const [activeItems, setActiveItems] = useState({});

     const toggleItem = (id) => {
       setActiveItems(prev => ({
         ...prev,
         [id]: !prev[id]
       }));
     };

     return (
       <nav className="menu">
         {items.map(item => (
           <MenuItem
             key={item.id}
             item={item}
             isActive={activeItems[item.id]}
             onToggle={() => toggleItem(item.id)}
           />
         ))}
       </nav>
     );
   }
   ```

### Porting to React.js - Overview

When migrating the Materio Bootstrap HTML template to React.js, follow these recommended steps:

1. **Project Setup**:
   ```bash
   # Create new React project
   npm create vite@latest materio-react -- --template react
   cd materio-react

   # Install dependencies
   npm install react-router-dom @mui/material @emotion/react @emotion/styled
   npm install sass react-icons react-chartjs-2 chart.js
   ```

2. **Configure Build Tools**:
   ```javascript
   // vite.config.js
   import { defineConfig } from 'vite';
   import react from '@vitejs/plugin-react';
   import path from 'path';

   export default defineConfig({
     plugins: [react()],
     resolve: {
       alias: {
         '@': path.resolve(__dirname, './src'),
       },
     },
   });
   ```

3. **Set Up Routing**:
   ```jsx
   // App.jsx
   import { BrowserRouter, Routes, Route } from 'react-router-dom';
   import MainLayout from './layouts/MainLayout';
   import AuthLayout from './layouts/AuthLayout';

   function App() {
     return (
       <BrowserRouter>
         <Routes>
           <Route path="/auth/*" element={<AuthLayout />} />
           <Route path="/*" element={<MainLayout />} />
         </Routes>
       </BrowserRouter>
     );
   }
   ```

4. **Implement Theme System**:
   ```jsx
   // contexts/ThemeContext.jsx
   export function ThemeProvider({ children }) {
     const [theme, setTheme] = useState({
       mode: 'light',
       colors: {
         primary: '#696cff',
         secondary: '#8592a3',
       },
     });

     useEffect(() => {
       document.documentElement.setAttribute('data-theme', theme.mode);
       Object.entries(theme.colors).forEach(([key, value]) => {
         document.documentElement.style.setProperty(`--${key}-color`, value);
       });
     }, [theme]);

     return (
       <ThemeContext.Provider value={{ theme, setTheme }}>
         {children}
       </ThemeContext.Provider>
     );
   }
   ```

By following this approach and implementing the components and functionality as shown in the examples, you can successfully port the Materio Bootstrap HTML template to a modern React application while maintaining its design and functionality.

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

## Frequently Asked Questions (FAQ)
**Source: [@https://demos.themeselection.com/materio-bootstrap-html-admin-template/documentation/faq.html](https://demos.themeselection.com/materio-bootstrap-html-admin-template/documentation/faq.html)**

This section addresses common questions and challenges that may arise when porting Materio from HTML/Bootstrap to React.js.

### General Questions

#### Q: How do I implement the template customizer in React?
**A:** The template customizer should be implemented using React's Context API:
1. Create a CustomizerContext to store theme settings
2. Implement a provider component that manages state and persistence
3. Create a customizer UI component that allows users to change settings
4. Use the context throughout your app to apply the selected theme settings

#### Q: Can I use the Materio SCSS files directly in my React project?
**A:** Yes, you can use the Materio SCSS files directly:
1. Install SASS in your React project: `npm install sass`
2. Copy the SCSS files to your project's src directory
3. Import the main SCSS file in your React app
4. You may need to adjust imports and paths in the SCSS files

#### Q: How do I replace jQuery plugins with React components?
**A:** For each jQuery plugin:
1. Look for a corresponding React component library (e.g., `react-select` for Select2)
2. If none exists, implement the functionality using React hooks and components
3. Replace jQuery event handlers with React event handling
4. Convert imperative logic to declarative React patterns

### React-Specific Questions

#### Q: How do I implement Materio's menu system in React?
**A:** The menu system can be implemented as follows:
```jsx
// Menu.jsx
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

function Menu() {
  const [openMenus, setOpenMenus] = useState({});
  
  const toggleSubmenu = (id) => {
    setOpenMenus(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  return (
    <nav className="main-menu">
      <ul className="menu-inner">
        {menuItems.map(item => (
          <li key={item.id} className={`menu-item ${openMenus[item.id] ? 'open' : ''}`}>
            {item.submenu ? (
              <>
                <a 
                  className="menu-link menu-toggle" 
                  onClick={() => toggleSubmenu(item.id)}
                >
                  <i className={item.icon}></i>
                  <span>{item.title}</span>
                </a>
                <ul className="menu-sub">
                  {item.submenu.map(subItem => (
                    <li key={subItem.id} className="menu-item">
                      <NavLink 
                        to={subItem.path}
                        className={({ isActive }) => 
                          `menu-link ${isActive ? 'active' : ''}`
                        }
                      >
                        <span>{subItem.title}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <NavLink 
                to={item.path}
                className={({ isActive }) => 
                  `menu-link ${isActive ? 'active' : ''}`
                }
              >
                <i className={item.icon}></i>
                <span>{item.title}</span>
              </NavLink>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

#### Q: How can I implement RTL support in React?
**A:** RTL support can be implemented using:
1. A context to store the current direction
2. CSS custom properties (variables) for direction-specific values
3. Conditional styling based on the current direction
4. Example implementation:

```jsx
// DirectionContext.js
import { createContext, useState, useEffect } from 'react';

export const DirectionContext = createContext();

export function DirectionProvider({ children }) {
  const [isRTL, setIsRTL] = useState(false);
  
  const toggleDirection = () => {
    setIsRTL(prev => !prev);
    localStorage.setItem('isRTL', !isRTL);
  };
  
  useEffect(() => {
    const storedDirection = localStorage.getItem('isRTL') === 'true';
    setIsRTL(storedDirection);
  }, []);
  
  useEffect(() => {
    document.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
  }, [isRTL]);
  
  return (
    <DirectionContext.Provider value={{ isRTL, toggleDirection }}>
      {children}
    </DirectionContext.Provider>
  );
}
```

#### Q: How do I handle responsive layouts in React?
**A:** Responsive layouts in React can be handled through:
1. CSS media queries (keep the same approach as in the HTML version)
2. React hooks for detecting viewport size
3. Conditional rendering based on screen size
4. Example custom hook:

```jsx
// useWindowSize.js
import { useState, useEffect } from 'react';

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });
  
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return windowSize;
}

// Usage in component:
function ResponsiveComponent() {
  const { width } = useWindowSize();
  const isMobile = width < 768;
  
  return (
    <div>
      {isMobile ? <MobileView /> : <DesktopView />}
    </div>
  );
}
```

### Troubleshooting Common Issues

#### Q: My styles aren't applying correctly in React. What could be wrong?
**A:** Common style issues and solutions:
1. **Scope issues**: Use CSS modules or styled-components to scope styles
2. **Import order**: Make sure Bootstrap is imported before your custom styles
3. **Class name conflicts**: React components might generate different class names
4. **Missing dependencies**: Ensure all style dependencies are installed

#### Q: How do I debug React component rendering issues?
**A:** To debug rendering issues:
1. Use React Developer Tools browser extension
2. Add console logs in useEffect and render functions
3. Use the React.StrictMode component during development
4. Check component keys when mapping arrays

#### Q: How can I optimize performance when porting complex UI components?
**A:** Optimization techniques:
1. Use React.memo for expensive components
2. Implement virtualization for long lists (react-window)
3. Use lazy loading for components and routes
4. Avoid unnecessary re-renders by carefully managing state
5. Break down complex components into smaller, focused ones

### Migration Strategy

#### Q: Should I migrate the entire template at once or incrementally?
**A:** An incremental approach is recommended:
1. Start with core layout components (navbar, sidebar, footer)
2. Add basic UI components (buttons, cards, inputs)
3. Implement page layouts
4. Add complex components and functionality
5. Finally, implement advanced features like the template customizer

#### Q: What's the best way to manage routing in my React port?
**A:** Use React Router with the following approach:
1. Create a routes configuration file that maps paths to components
2. Implement nested routes for nested layouts
3. Use lazy loading for route components
4. Implement route guards for protected routes
5. Example:

```jsx
// routes.js
import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Loading from './components/Loading';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));
const Users = lazy(() => import('./pages/Users'));
const Login = lazy(() => import('./pages/Login'));

function AppRoutes() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
```

#### Q: How can I ensure my React port maintains the same look and feel as the original?
**A:** To maintain visual consistency:
1. Use the same SCSS variables and mixins
2. Implement the same responsive breakpoints
3. Test across multiple devices and screen sizes
4. Use the same assets (icons, images, fonts)
5. Compare rendered output with the original template side by side

By addressing these common questions and following the provided solutions, you can streamline the process of porting Materio from HTML/Bootstrap to React.js.

## Layouts
**Source: [@https://demos.themeselection.com/materio-bootstrap-html-admin-template/documentation/layouts.html](https://demos.themeselection.com/materio-bootstrap-html-admin-template/documentation/layouts.html)**

The Materio template provides various layout options that need to be implemented in React while maintaining the theme and vertical sidebar behavior. This section covers the implementation of different layouts and their customization.

### Layout Structure in React

The layout system in React should be implemented using a component-based approach:

```jsx
// Layouts/MainLayout.jsx
import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';

function MainLayout({ children }) {
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [isNavbarFixed, setIsNavbarFixed] = useState(true);
  const [isFooterFixed, setIsFooterFixed] = useState(false);

  return (
    <div className={`layout-wrapper ${isMenuCollapsed ? 'menu-collapsed' : ''}`}>
      <Navbar 
        isFixed={isNavbarFixed}
        onMenuToggle={() => setIsMenuCollapsed(!isMenuCollapsed)}
      />
      <div className="layout-container">
        <Sidebar isCollapsed={isMenuCollapsed} />
        <main className="layout-content">
          {children}
        </main>
      </div>
      <Footer isFixed={isFooterFixed} />
    </div>
  );
}
```

### Theme Implementation

The theme system should be implemented using React Context and CSS variables:

```jsx
// contexts/ThemeContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState({
    mode: 'light',
    primaryColor: '#696cff',
    secondaryColor: '#8592a3',
    // other theme variables
  });

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme.mode);
    document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', theme.secondaryColor);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
```

### Vertical Sidebar Implementation

The vertical sidebar should be implemented with collapsible behavior and nested navigation:

```jsx
// components/layout/Sidebar.jsx
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

function Sidebar({ isCollapsed }) {
  const { theme } = useTheme();
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const toggleSubmenu = (menuId) => {
    setActiveSubmenu(activeSubmenu === menuId ? null : menuId);
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <img 
          src={theme.mode === 'light' ? '/logo-light.png' : '/logo-dark.png'} 
          alt="Logo"
        />
      </div>
      
      <nav className="sidebar-nav">
        <ul className="nav-items">
          {menuItems.map(item => (
            <li key={item.id} className="nav-item">
              {item.submenu ? (
                <>
                  <button
                    className={`nav-link ${activeSubmenu === item.id ? 'active' : ''}`}
                    onClick={() => toggleSubmenu(item.id)}
                  >
                    <i className={item.icon}></i>
                    {!isCollapsed && <span>{item.title}</span>}
                  </button>
                  
                  {!isCollapsed && activeSubmenu === item.id && (
                    <ul className="submenu">
                      {item.submenu.map(subItem => (
                        <li key={subItem.id}>
                          <NavLink
                            to={subItem.path}
                            className={({ isActive }) => 
                              `submenu-link ${isActive ? 'active' : ''}`
                            }
                          >
                            {subItem.title}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) => 
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                >
                  <i className={item.icon}></i>
                  {!isCollapsed && <span>{item.title}</span>}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
```

### Layout Customization

Layout customization should be handled through a settings context:

```jsx
// contexts/LayoutContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const LayoutContext = createContext();

export function LayoutProvider({ children }) {
  const [layoutSettings, setLayoutSettings] = useState({
    isMenuCollapsed: false,
    isNavbarFixed: true,
    isFooterFixed: false,
    containerWidth: 'fluid',
    menuPosition: 'vertical',
    // other layout settings
  });

  useEffect(() => {
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('layoutSettings');
    if (savedSettings) {
      setLayoutSettings(JSON.parse(savedSettings));
    }
  }, []);

  const updateLayoutSettings = (newSettings) => {
    setLayoutSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('layoutSettings', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <LayoutContext.Provider value={{ layoutSettings, updateLayoutSettings }}>
      {children}
    </LayoutContext.Provider>
  );
}

export const useLayout = () => useContext(LayoutContext);
```

### Responsive Behavior

Implement responsive behavior using custom hooks and CSS:

```jsx
// hooks/useResponsive.js
import { useState, useEffect } from 'react';

export function useResponsive() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { isMobile, isTablet };
}

// Usage in layout component
function Layout() {
  const { isMobile } = useResponsive();
  const { layoutSettings, updateLayoutSettings } = useLayout();

  useEffect(() => {
    if (isMobile) {
      updateLayoutSettings({ isMenuCollapsed: true });
    }
  }, [isMobile]);

  return (
    // Layout JSX
  );
}
```

### CSS for Layout Components

```scss
// scss/layout/_sidebar.scss
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 260px;
  background: var(--sidebar-bg);
  transition: all 0.3s ease;
  z-index: 1000;

  &.collapsed {
    width: 70px;

    .nav-link span,
    .submenu {
      display: none;
    }
  }

  .nav-link {
    display: flex;
    align-items: center;
    padding: 0.75rem 1rem;
    color: var(--text-color);
    text-decoration: none;
    transition: all 0.3s ease;

    &:hover,
    &.active {
      background: var(--sidebar-hover-bg);
      color: var(--primary-color);
    }

    i {
      margin-right: 0.75rem;
      font-size: 1.25rem;
    }
  }

  .submenu {
    padding-left: 1rem;
    background: var(--sidebar-submenu-bg);
  }
}

// scss/layout/_navbar.scss
.navbar {
  position: fixed;
  top: 0;
  right: 0;
  left: 260px;
  height: 70px;
  background: var(--navbar-bg);
  transition: all 0.3s ease;
  z-index: 999;

  &.navbar-fixed {
    position: fixed;
  }

  .navbar-brand {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 1rem;
  }

  .navbar-content {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 1rem;
  }
}

// scss/layout/_content.scss
.layout-content {
  margin-left: 260px;
  padding: 70px 1.5rem 1.5rem;
  min-height: 100vh;
  background: var(--content-bg);
  transition: all 0.3s ease;

  .sidebar-collapsed & {
    margin-left: 70px;
  }
}
```

By implementing these components and styles, you can create a flexible and responsive layout system that matches the original Materio template's functionality while leveraging React's component model and state management capabilities.

## Folder Structure
**Source: [@https://demos.themeselection.com/materio-bootstrap-html-admin-template/documentation/folder-structure.html](https://demos.themeselection.com/materio-bootstrap-html-admin-template/documentation/folder-structure.html)**

The Materio template's folder structure needs to be adapted for a React.js application while maintaining organization and scalability. This section outlines the recommended folder structure for the React port.

### React Project Structure

```
materio-react/
├── public/
│   ├── assets/
│   │   ├── fonts/           # Font files
│   │   ├── images/          # Static images
│   │   └── icons/           # Icon files
│   ├── index.html           # Main HTML file
│   └── favicon.ico          # Favicon
├── src/
│   ├── components/          # Reusable components
│   │   ├── ui/             # Basic UI components
│   │   │   ├── Button/
│   │   │   ├── Card/
│   │   │   ├── Input/
│   │   │   └── Table/
│   │   ├── layout/         # Layout components
│   │   │   ├── Navbar/
│   │   │   ├── Sidebar/
│   │   │   └── Footer/
│   │   └── extended/       # Extended UI components
│   │       ├── Charts/
│   │       ├── Forms/
│   │       └── Tables/
│   ├── contexts/           # React contexts
│   │   ├── ThemeContext.js
│   │   ├── AuthContext.js
│   │   └── LayoutContext.js
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useTheme.js
│   │   └── useResponsive.js
│   ├── layouts/            # Page layouts
│   │   ├── MainLayout.jsx
│   │   ├── AuthLayout.jsx
│   │   └── BlankLayout.jsx
│   ├── pages/              # Page components
│   │   ├── auth/
│   │   ├── dashboard/
│   │   └── settings/
│   ├── scss/               # SCSS files
│   │   ├── _bootstrap-extended/
│   │   ├── _custom-variables/
│   │   ├── _theme/
│   │   ├── base/
│   │   ├── components/
│   │   ├── layouts/
│   │   └── main.scss
│   ├── services/           # API services
│   │   ├── api.js
│   │   └── auth.js
│   ├── utils/              # Utility functions
│   │   ├── helpers.js
│   │   └── validators.js
│   ├── routes/             # Route configurations
│   │   └── index.js
│   ├── config/             # Configuration files
│   │   ├── theme.js
│   │   └── menu.js
│   ├── App.jsx             # Root component
│   └── index.jsx           # Entry point
├── .env                    # Environment variables
├── .gitignore             # Git ignore file
├── package.json           # Dependencies and scripts
├── README.md              # Project documentation
└── vite.config.js         # Vite configuration
```

### Component Organization

Each component should follow a consistent structure:

```
components/
└── Button/
    ├── index.jsx          # Main component file
    ├── Button.module.scss # Component styles
    ├── Button.test.jsx    # Component tests
    └── types.ts           # TypeScript types (if using TS)
```

### SCSS Organization

The SCSS structure should mirror the component organization:

```
scss/
├── _bootstrap-extended/    # Bootstrap overrides
├── _custom-variables/     # Custom SCSS variables
├── _theme/               # Theme variables and mixins
├── base/                 # Base styles
│   ├── _typography.scss
│   ├── _reset.scss
│   └── _variables.scss
├── components/           # Component styles
│   ├── _buttons.scss
│   ├── _cards.scss
│   └── _forms.scss
├── layouts/             # Layout styles
│   ├── _navbar.scss
│   ├── _sidebar.scss
│   └── _footer.scss
└── main.scss           # Main SCSS file
```

### Implementation Example

Here's how to implement the folder structure in your React project:

1. **Create the Base Structure**:
```bash
mkdir -p src/{components,contexts,hooks,layouts,pages,scss,services,utils,routes,config}
```

2. **Set Up Component Structure**:
```jsx
// src/components/ui/Button/index.jsx
import styles from './Button.module.scss';

export function Button({ children, variant = 'primary', ...props }) {
  return (
    <button 
      className={`${styles.button} ${styles[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

3. **Configure SCSS Modules**:
```scss
// src/components/ui/Button/Button.module.scss
.button {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s;

  &.primary {
    background: var(--primary-color);
    color: white;
  }

  &.secondary {
    background: var(--secondary-color);
    color: white;
  }
}
```

4. **Set Up Context Structure**:
```jsx
// src/contexts/ThemeContext.js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState({
    mode: 'light',
    colors: {
      primary: '#696cff',
      secondary: '#8592a3',
    }
  });

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
```

5. **Configure Routes**:
```jsx
// src/routes/index.js
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

const Dashboard = lazy(() => import('../pages/dashboard'));
const Settings = lazy(() => import('../pages/settings'));

export function AppRoutes() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
```

6. **Set Up Configuration Files**:
```javascript
// src/config/theme.js
export const themeConfig = {
  colors: {
    primary: '#696cff',
    secondary: '#8592a3',
    success: '#71dd37',
    info: '#03c3ec',
    warning: '#ffab00',
    danger: '#ff3e1d',
  },
  breakpoints: {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
  }
};

// src/config/menu.js
export const menuConfig = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: 'bx-home',
    path: '/'
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: 'bx-cog',
    path: '/settings'
  }
];
```

### Best Practices

1. **Component Organization**:
   - Keep components small and focused
   - Use index.js files for clean exports
   - Group related components together
   - Maintain consistent naming conventions

2. **File Naming**:
   - Use PascalCase for component files
   - Use camelCase for utility files
   - Use kebab-case for SCSS files
   - Add .module.scss suffix for CSS modules

3. **Import Organization**:
   - Group imports by type (React, third-party, local)
   - Use absolute imports for cleaner paths
   - Maintain consistent import order

4. **State Management**:
   - Use contexts for global state
   - Keep component state local when possible
   - Use custom hooks for shared logic

5. **Asset Management**:
   - Keep assets organized by type
   - Use appropriate file formats
   - Optimize assets for production

By following this folder structure and best practices, you can create a maintainable and scalable React application that preserves the functionality of the original Materio template while leveraging React's component model and modern development practices.

## Comprehensive Revision

I'll now proceed with a comprehensive revision of all sections to ensure consistency and completeness. Would you like me to start with the Introduction section?