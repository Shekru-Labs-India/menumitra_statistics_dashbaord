# CSS Documentation

This document provides a comprehensive overview of the CSS styling used in the MenuMitra Owner Dashboard application. It covers the structure of CSS files, theme configurations, and available styling components.

## Table of Contents

1. [CSS File Structure](#css-file-structure)
2. [Theme Configuration](#theme-configuration)
3. [Core Styling](#core-styling)
4. [Core Light Theme (core.css)](#core-light-theme-corecss)
5. [Core Dark Theme (core-dark.css)](#core-dark-theme-core-darkcss)
6. [Theme Files](#theme-files)
   - [Theme Default (theme-default.css)](#theme-default-theme-defaultcss)
   - [Theme Default Dark (theme-default-dark.css)](#theme-default-dark-theme-default-darkcss)
   - [Theme Bordered (theme-bordered.css)](#theme-bordered-theme-borderedcss)
   - [Theme Semi-Dark (theme-semi-dark.css)](#theme-semi-dark-theme-semi-darkcss)
7. [Modal Styling (modal.css)](#modal-styling-modalcss)
8. [Demo Styling (demo.css)](#demo-styling-democss)
9. [Application-Specific CSS Files](#application-specific-css-files)
   - [Chat Application (app-chat.css)](#chat-application-app-chatcss)
   - [Email Application (app-email.css)](#email-application-app-emailcss)
   - [Calendar Application (app-calendar.css)](#calendar-application-app-calendarcss)
   - [Kanban Board (app-kanban.css)](#kanban-board-app-kanbancss)
   - [Invoice Management (app-invoice.css)](#invoice-management-app-invoicecss)
   - [Invoice Print (app-invoice-print.css)](#invoice-print-app-invoice-printcss)
   - [E-commerce Dashboard (app-ecommerce-dashboard.css)](#e-commerce-dashboard-app-ecommerce-dashboardcss)
   - [E-commerce General (app-ecommerce.css)](#e-commerce-general-app-ecommercecss)
   - [Logistics Dashboard (app-logistics-dashboard.css)](#logistics-dashboard-app-logistics-dashboardcss)
   - [Logistics Fleet (app-logistics-fleet.css)](#logistics-fleet-app-logistics-fleetcss)
10. [Page-Specific CSS Files](#page-specific-css-files)
    - [Authentication Pages (page-auth.css)](#authentication-pages-page-authcss)
    - [User Profile (page-profile.css)](#user-profile-page-profilecss)
    - [User View (page-user-view.css)](#user-view-page-user-viewcss)
    - [Account Settings (page-account-settings.css)](#account-settings-page-account-settingscss)
    - [FAQ Page (page-faq.css)](#faq-page-page-faqcss)
    - [Pricing Page (page-pricing.css)](#pricing-page-page-pricingcss)
    - [Miscellaneous Pages (page-misc.css)](#miscellaneous-pages-page-misccss)
    - [Icons Page (page-icons.css)](#icons-page-page-iconscss)
11. [UI Component CSS Files](#ui-component-css-files)
    - [Carousel (ui-carousel.css)](#carousel-ui-carouselcss)
    - [Cards - Statistics (cards-statistics.css)](#cards---statistics-cards-statisticscss)
    - [Cards - Gamifications (cards-gamifications.css)](#cards---gamifications-cards-gamificationscss)
    - [Front Page Components](#front-page-components)
    - [Wizard Components](#wizard-components)
12. [Component Styling](#component-styling)
13. [Layout & Spacing](#layout--spacing)
14. [Responsive Design](#responsive-design)
15. [Utility Classes](#utility-classes)
16. [Page-Specific Styling](#page-specific-styling)
17. [Animation & Transitions](#animation--transitions)
18. [Third-Party Libraries](#third-party-libraries)
19. [Using This Documentation](#using-this-documentation)
20. [Conclusion](#conclusion)
21. [Complete CSS File Reference](#complete-css-file-reference)

## CSS File Structure

The application uses a modular CSS structure with the following organization:

### Root CSS Files
- `src/index.css` - Base styling and CSS variables
- `src/App.css` - Application-specific styling

### Asset CSS Files
- `src/assets/css/core.css` - Core Bootstrap styling (785KB)
- `src/assets/css/core-dark.css` - Dark mode core styling (787KB)
- `src/assets/css/demo.css` - Demo-specific styling (2.6KB)
- `src/assets/css/modal.css` - Modal component styling (493B)

### Theme Files
- `src/assets/css/theme-default.css` - Default theme (primary color: #8c57ff) (46KB)
- `src/assets/css/theme-default-dark.css` - Dark version of default theme (47KB)
- `src/assets/css/theme-bordered.css` - Bordered version of theme (50KB)
- `src/assets/css/theme-semi-dark.css` - Semi-dark theme variation (47KB)

### Application-Specific CSS Files
- `src/assets/css/app-chat.css` - Chat application styling (11KB)
- `src/assets/css/app-email.css` - Email application styling (10KB)
- `src/assets/css/app-calendar.css` - Calendar application styling (3.6KB)
- `src/assets/css/app-kanban.css` - Kanban board styling (4.6KB)
- `src/assets/css/app-invoice.css` - Invoice management styling (1.1KB)
- `src/assets/css/app-invoice-print.css` - Invoice print styling (372B)
- `src/assets/css/app-ecommerce.css` - E-commerce general styling (302B)
- `src/assets/css/app-ecommerce-dashboard.css` - E-commerce dashboard styling (128B)
- `src/assets/css/app-logistics-dashboard.css` - Logistics dashboard styling (1.0KB)
- `src/assets/css/app-logistics-fleet.css` - Logistics fleet management styling (2.1KB)
- `src/assets/css/app-academy.css` - Academy application styling (472B)
- `src/assets/css/app-academy-details.css` - Academy details styling (87B)

### Page-Specific CSS Files
- `src/assets/css/page-auth.css` - Authentication pages styling (2.0KB)
- `src/assets/css/page-profile.css` - User profile page styling (556B)
- `src/assets/css/page-user-view.css` - User view page styling (1.1KB)
- `src/assets/css/page-account-settings.css` - Account settings page styling (145B)
- `src/assets/css/page-faq.css` - FAQ page styling (707B)
- `src/assets/css/page-pricing.css` - Pricing page styling (483B)
- `src/assets/css/page-misc.css` - Miscellaneous pages styling (529B)
- `src/assets/css/page-icons.css` - Icons page styling (309B)

### UI Component CSS Files
- `src/assets/css/ui-carousel.css` - Carousel component styling (700B)
- `src/assets/css/cards-statistics.css` - Statistical cards styling (188B)
- `src/assets/css/cards-gamifications.css` - Gamification cards styling (128B)
- `src/assets/css/front-page.css` - Front page general styling (5.3KB)
- `src/assets/css/front-page-landing.css` - Landing page styling (5.0KB)
- `src/assets/css/front-page-pricing.css` - Front-facing pricing page styling (1017B)
- `src/assets/css/front-page-help-center.css` - Help center styling (431B)
- `src/assets/css/front-page-payment.css` - Payment page styling (84B)
- `src/assets/css/wizard-ex-checkout.css` - Checkout wizard styling (53B)
- `src/assets/css/dashboards-crm.css` - CRM dashboard styling (32B)

### Vendor CSS Files
- `src/assets/vendor/css/rtl/` - Right-to-left language support
- `src/assets/vendor/css/pages/` - Page-specific styling
- `src/assets/vendor/libs/animate-css/animate.css` - Animation library

## Theme Configuration

### Default Theme
The default theme uses a purple primary color (#8c57ff) with the following color scheme:

- Primary: #8c57ff (Purple)
- Background: #f4f5fa (Light gray)
- Text: #433c50 (Dark gray)
- Light text: #e7dcff (Light purple)

### Color Variations
The theme includes several color variations:
- Default (Light)
- Dark
- Semi-dark
- Bordered

### Theme Switching
The application supports theme switching through CSS class toggling:
- `.light-style` - Light theme
- `.dark-style` - Dark theme

## Core Styling

### Typography
```css
:root {
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
}
```

### Links
```css
a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}
a:hover {
  color: #535bf2;
}
```

### Buttons
```css
button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}
button:hover {
  border-color: #646cff;
}
button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}
```

## Component Styling

### Navbar
The application includes styling for fixed and responsive navigation bars:

```css
.layout-navbar-fixed .layout-wrapper:not(.layout-without-menu) .layout-page {
  padding-top: 64px !important;
}

.content-wrapper .navbar {
  z-index: auto;
}
```

### Modals
Modal components have custom animations:

```css
.modal {
  animation-duration: 0.5s;
}

.modal-dialog {
  animation-duration: 0.3s;
}

.modal-backdrop {
  animation-duration: 0.5s;
}
```

### Forms
Form elements are styled with the primary theme color:

```css
.form-control:focus, .form-select:focus {
  border-color: #8c57ff !important;
}

.form-check-input:checked {
  background-color: #8c57ff;
  border-color: #8c57ff;
}
```

### Tables
Tables have custom styling with striped rows and hover effects:

```css
.table-primary {
  --bs-table-bg: #e8ddff;
  --bs-table-striped-bg: #e1d6f7;
  --bs-table-striped-color: #2e263d;
  --bs-table-active-bg: #d9ceef;
  --bs-table-active-color: #2e263d;
  --bs-table-hover-bg: #ddd2f3;
  --bs-table-hover-color: #2e263d;
  color: #2e263d;
  border-color: #d2c7e8;
}
```

### Cards
Cards have shadow and border effects:

```css
.card.card-border-shadow-primary::after {
  border-bottom-color: #ba9aff;
}

.card.card-border-shadow-primary:hover::after {
  border-bottom-color: #8c57ff;
}
```

### Alerts
Multiple alert styles are available:

```css
.alert-primary {
  background-color: #ede4ff;
  border-color: #ede4ff;
  color: #8c57ff;
}

.alert-outline-primary {
  border-color: #8c57ff;
  color: #8c57ff;
}

.alert-solid-primary {
  background-color: #8c57ff;
  color: #fff;
}
```

## Layout & Spacing

### Spacing Classes
The application includes utility classes for consistent spacing:

```css
.demo-vertical-spacing > * {
  margin-top: 1.25rem !important;
  margin-bottom: 0 !important;
}

.demo-vertical-spacing-lg > * {
  margin-top: 1.875rem !important;
  margin-bottom: 0 !important;
}

.demo-vertical-spacing-xl > * {
  margin-top: 5rem !important;
  margin-bottom: 0 !important;
}
```

### Layout Wrappers
Layout wrapper classes for different page layouts:

```css
.layout-demo-wrapper {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 1.25rem;
}
```

## Responsive Design

### Media Queries
The application includes responsive breakpoints:

```css
@media (max-width: 576px) {
  #dropdown-variation-demo .btn-group .text-truncate {
    width: 300px;
    position: relative;
  }
}

@media (prefers-color-scheme: light) {
  :root {
    color: #213547;
    background-color: #ffffff;
  }
}
```

### Responsive Layout
The layout adapts to different screen sizes:

```css
body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}
```

## Utility Classes

### Text Utilities
```css
.text-primary {
  color: #8c57ff !important;
}
```

### Background Utilities
```css
.bg-primary {
  background-color: #8c57ff !important;
}

.bg-label-primary {
  background-color: #ede4ff !important;
  color: #8c57ff !important;
}
```

### Border Utilities
```css
.border-primary {
  border-color: #8c57ff !important;
}
```

## Page-Specific Styling

The application includes specific styling for different pages:

### Authentication Pages
```css
.authentication-wrapper {
  display: flex;
  flex-basis: 100%;
  min-height: 100vh;
  width: 100%;
}

.authentication-wrapper.authentication-basic {
  align-items: center;
  justify-content: center;
}
```

### Dashboard Pages
Various dashboard-specific styles for components like cards, charts, and statistics.

## Animation & Transitions

### Modal Animations
```css
@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes modalFadeOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
}
```

### Button Transitions
```css
button {
  transition: border-color 0.25s;
}
```

### Hover Effects
Various hover effects for interactive elements:

```css
a:hover {
  color: #535bf2;
}

button:hover {
  border-color: #646cff;
}

.card.card-border-shadow-primary:hover::after {
  border-bottom-color: #8c57ff;
}
```

## Third-Party Libraries

### Animate.css
The application uses the Animate.css library for animations. This library provides a wide range of CSS animations that can be applied to elements.

```css
:root {
  --animate-duration: 1s;
  --animate-delay: 1s;
  --animate-repeat: 1;
}

.animate__animated {
  animation-duration: 1s;
  animation-duration: var(--animate-duration);
  animation-fill-mode: both;
}
```

#### Available Animation Classes
- Attention seekers: `animate__bounce`, `animate__flash`, `animate__pulse`, `animate__rubberBand`, `animate__shakeX`, `animate__shakeY`, `animate__headShake`, `animate__swing`, `animate__tada`, `animate__wobble`, `animate__jello`, `animate__heartBeat`
- Entrance animations: `animate__backInDown`, `animate__backInLeft`, `animate__backInRight`, `animate__backInUp`, `animate__bounceIn`, `animate__bounceInDown`, `animate__bounceInLeft`, `animate__bounceInRight`, `animate__bounceInUp`, `animate__fadeIn`, `animate__fadeInDown`, `animate__fadeInLeft`, `animate__fadeInRight`, `animate__fadeInUp`, etc.
- Exit animations: `animate__backOutDown`, `animate__backOutLeft`, `animate__backOutRight`, `animate__backOutUp`, `animate__bounceOut`, `animate__bounceOutDown`, `animate__bounceOutLeft`, `animate__bounceOutRight`, `animate__bounceOutUp`, `animate__fadeOut`, etc.

#### Animation Speed Control
```css
.animate__animated.animate__faster {
  animation-duration: 0.5s;
}
.animate__animated.animate__fast {
  animation-duration: 0.8s;
}
.animate__animated.animate__slow {
  animation-duration: 2s;
}
.animate__animated.animate__slower {
  animation-duration: 3s;
}
```

#### Animation Delay
```css
.animate__animated.animate__delay-1s {
  animation-delay: 1s;
}
.animate__animated.animate__delay-2s {
  animation-delay: 2s;
}
.animate__animated.animate__delay-3s {
  animation-delay: 3s;
}
```

#### Usage Example
```html
<div class="animate__animated animate__fadeIn animate__delay-1s">
  This element will fade in after 1 second
</div>
```

## Using This Documentation

### Best Practices for Web Design Prompts

When creating new components or pages for the MenuMitra Owner Dashboard, follow these best practices:

1. **Check Theme First**: Always check if the required styling is already provided by the theme before adding custom CSS.
   - Search this documentation for relevant component classes
   - Look for utility classes that can be combined to achieve the desired effect
   - Check the theme color variables and utility classes before defining custom colors

2. **Use Existing Components**: Leverage the pre-styled components in the theme:
   - Cards, alerts, buttons, and form elements already have consistent styling
   - Use the existing class naming patterns (e.g., `.btn-primary`, `.alert-primary`, etc.)

3. **Utility Classes Over Custom CSS**: Prefer using utility classes for:
   - Spacing (margins and padding)
   - Colors (text, background, borders)
   - Flexbox layouts
   - Text alignment and styling

4. **When to Use Custom CSS**:
   - Only add custom CSS when the required styling cannot be achieved with existing theme classes
   - Place custom CSS in the appropriate component-specific files
   - Follow the existing naming conventions

### Example Workflow

1. **Need**: "I need to create a purple card with a shadow effect"
2. **Check Documentation**: Look in the Cards section to find `.card.card-border-shadow-primary`
3. **Implementation**: Use the existing class instead of writing custom CSS:
   ```html
   <div class="card card-border-shadow-primary">
     <!-- Card content -->
   </div>
   ```

4. **Need**: "I need to add spacing between elements"
5. **Check Documentation**: Look in the Layout & Spacing section to find `.demo-vertical-spacing`
6. **Implementation**: Use the existing utility class:
   ```html
   <div class="demo-vertical-spacing">
     <div>Element 1</div>
     <div>Element 2</div>
     <div>Element 3</div>
   </div>
   ```

### Theme Class Reference Quick Guide

#### Common Component Classes
- Buttons: `.btn`, `.btn-primary`, `.btn-outline-primary`, `.btn-label-primary`
- Cards: `.card`, `.card-border-shadow-primary`
- Alerts: `.alert-primary`, `.alert-outline-primary`, `.alert-solid-primary`
- Tables: `.table-primary`
- Forms: `.form-control`, `.form-select`, `.form-check-input`

#### Common Utility Classes
- Text: `.text-primary`, `.text-body`, `.text-heading`
- Background: `.bg-primary`, `.bg-label-primary`, `.bg-gradient-primary`
- Border: `.border-primary`
- Spacing: `.demo-vertical-spacing`, `.demo-vertical-spacing-lg`, `.demo-vertical-spacing-xl`
- Layout: `.layout-navbar-fixed`, `.layout-wrapper`, `.layout-without-menu`

#### Animation Classes
- Modal: Use the modal animations defined in `modal.css`
- General: Use Animate.css classes like `.animate__fadeIn`, `.animate__bounce`, etc.

By following this approach, you'll maintain consistency across the application and reduce the amount of custom CSS needed.

## Core Dark Theme (core-dark.css)

The `core-dark.css` file (787KB) provides the dark mode styling for the MenuMitra Owner Dashboard application. This file contains all the necessary CSS rules to transform the application's appearance into a dark theme.

### File Overview

- **File Size**: 787KB
- **Purpose**: Provides dark mode styling for the entire application
- **Usage**: Applied when the `.dark-style` class is added to the document

### Key Features

1. **Dark Color Palette**
   - Dark backgrounds
   - Light text colors
   - Adjusted contrast for readability
   - Reduced brightness for comfortable viewing in low-light environments

2. **Component Adaptations**
   - All UI components are adapted for dark mode
   - Shadows and highlights are adjusted for dark backgrounds
   - Form elements have appropriate contrast

3. **Accessibility Considerations**
   - Maintains sufficient contrast ratios for text readability
   - Interactive elements remain clearly distinguishable

### Structure

The file follows the same structure as `core.css` but with color values adjusted for dark mode:

1. **CSS Variables**: Root variables defining the dark theme color palette
2. **Base Elements**: Styling for HTML elements (body, headings, paragraphs, etc.)
3. **Layout Components**: Containers, grids, and layout structures
4. **UI Components**: Buttons, cards, modals, etc. adapted for dark mode
5. **Form Elements**: Inputs, selects, checkboxes, etc. with dark styling
6. **Utility Classes**: Helper classes with dark mode values

### Integration with Theme System

The dark theme works in conjunction with other theme files:
- `theme-default-dark.css`: Applies the primary color scheme to the dark theme
- Can be combined with other theme variations (semi-dark, bordered)

### Usage Guidelines

1. **Activating Dark Mode**:
   ```javascript
   // Add the dark-style class to the document
   document.documentElement.classList.add('dark-style');
   // Remove light-style if present
   document.documentElement.classList.remove('light-style');
   ```

2. **Testing Dark Mode**:
   - Always test components in both light and dark modes
   - Check for sufficient contrast and readability
   - Ensure interactive elements are clearly visible

3. **Custom Components**:
   - When creating custom components, refer to existing dark mode styles
   - Use CSS variables instead of hardcoded color values
   - Test in both light and dark modes

### Common Dark Mode Classes

- `.dark-style`: The main class that activates dark mode
- `.dark-style .bg-body`: Dark background for body elements
- `.dark-style .card`: Dark styled cards
- `.dark-style .navbar`: Dark navigation bars
- `.dark-style .form-control`: Dark form inputs

### Technical Implementation

The dark theme implementation follows these principles:

1. **CSS Variables**: Uses CSS custom properties for consistent theming
2. **Selector Specificity**: Uses `.dark-style` prefix for all selectors
3. **Component Consistency**: Maintains the same structure as light theme
4. **Performance Optimization**: Minified for production use

### Best Practices When Working with Dark Mode

1. **Use Theme Variables**: Always use CSS variables instead of hardcoded colors
2. **Test Both Modes**: Ensure all components work in both light and dark modes
3. **Consider Contrast**: Maintain WCAG AA compliance for text contrast
4. **Images and Icons**: Provide dark-mode alternatives for images and icons
5. **Transitions**: Consider adding transitions when switching between modes

## Core Light Theme (core.css)

The `core.css` file (785KB) provides the base light mode styling for the MenuMitra Owner Dashboard application. This file is based on Bootstrap v5.3.3 and contains all the necessary CSS rules for the application's default light theme.

### File Overview

- **File Size**: 785KB
- **Source**: Based on Bootstrap v5.3.3
- **Purpose**: Provides light mode styling for the entire application
- **Usage**: Applied when the `.light-style` class is added to the document (default)

### Key Features

1. **Light Color Palette**
   - Light backgrounds
   - Dark text colors
   - Optimized contrast for readability
   - Clean, modern aesthetic

2. **Bootstrap Components**
   - Complete set of Bootstrap 5.3.3 components
   - Customized to match the MenuMitra design system
   - Responsive and mobile-friendly

3. **Accessibility Features**
   - WCAG AA compliant color contrast
   - Focus states for interactive elements
   - Semantic HTML support

### Structure

The file is organized according to the Bootstrap framework structure:

1. **CSS Variables**: Root variables defining the light theme color palette
2. **Reboot**: Normalized styling for HTML elements
3. **Layout**: Container, grid, and responsive utilities
4. **Content**: Typography, tables, and basic content styling
5. **Components**: UI components like buttons, cards, modals, etc.
6. **Forms**: Input controls, selects, checkboxes, etc.
7. **Utilities**: Helper classes for spacing, colors, display, etc.

### Integration with Theme System

The light theme works as the foundation for other theme files:
- `theme-default.css`: Applies the primary color scheme to the light theme
- Can be combined with other theme variations (bordered)

### Usage Guidelines

1. **Default Theme**:
   ```javascript
   // The light-style class is applied by default
   // To explicitly set it:
   document.documentElement.classList.add('light-style');
   // Remove dark-style if present
   document.documentElement.classList.remove('dark-style');
   ```

2. **Component Usage**:
   - Follow Bootstrap 5 documentation for component usage
   - Use the MenuMitra-specific class variations when available
   - Test components in different viewport sizes

3. **Custom Components**:
   - When creating custom components, follow Bootstrap patterns
   - Use the established CSS variables for consistency
   - Maintain responsive behavior

### Common Light Mode Classes

- `.light-style`: The main class that activates light mode (default)
- `.light-style .bg-body`: Light background for body elements
- `.light-style .card`: Light styled cards
- `.light-style .navbar`: Light navigation bars
- `.light-style .form-control`: Light form inputs

### Technical Implementation

The light theme implementation follows these principles:

1. **Bootstrap Foundation**: Built on Bootstrap 5.3.3
2. **CSS Variables**: Uses CSS custom properties for consistent theming
3. **Selector Specificity**: Uses `.light-style` prefix for theme-specific selectors
4. **Performance Optimization**: Minified for production use

### Best Practices When Working with Light Mode

1. **Use Theme Variables**: Always use CSS variables instead of hardcoded colors
2. **Follow Bootstrap Patterns**: Leverage existing Bootstrap components and utilities
3. **Responsive Design**: Test all components across different viewport sizes
4. **Accessibility**: Maintain proper contrast ratios and focus states
5. **Documentation**: Reference this documentation and Bootstrap docs when implementing new features

## Theme Files

The MenuMitra Owner Dashboard uses a flexible theming system with multiple theme files that can be combined to create different visual appearances. These theme files work in conjunction with the core CSS files to provide a consistent and customizable user interface.

### Theme Default (theme-default.css)

The `theme-default.css` file (46KB) applies the primary color scheme to the light theme of the application.

#### File Overview

- **File Size**: 46KB
- **Primary Color**: #8c57ff (Purple)
- **Background Color**: #f4f5fa (Light gray)
- **Text Color**: #433c50 (Dark gray)
- **Purpose**: Defines the color scheme for the light theme

#### Key Features

1. **Color Definitions**
   - Primary color: #8c57ff (Purple)
   - Background color: #f4f5fa
   - Text colors for various states
   - Gradient definitions

2. **Component Styling**
   - Applies the primary color to all UI components
   - Defines hover, active, and focus states
   - Sets up consistent color patterns across the application

3. **Utility Classes**
   - `.text-primary`: Sets text color to primary color
   - `.bg-primary`: Sets background color to primary color
   - `.bg-label-primary`: Sets a lighter background with primary text
   - `.border-primary`: Sets border color to primary color

#### Usage

This file is used when the light theme is active (default) and provides the purple color scheme to the application. It should be included after the core.css file:

```html
<link rel="stylesheet" href="src/assets/css/core.css">
<link rel="stylesheet" href="src/assets/css/theme-default.css">
```

### Theme Default Dark (theme-default-dark.css)

The `theme-default-dark.css` file (47KB) applies the primary color scheme to the dark theme of the application.

#### File Overview

- **File Size**: 47KB
- **Primary Color**: #8c57ff (Purple)
- **Background Color**: #28243d (Dark purple/blue)
- **Text Color**: #d5d1ea (Light lavender)
- **Purpose**: Defines the color scheme for the dark theme

#### Key Features

1. **Dark Mode Color Definitions**
   - Primary color: #8c57ff (same as light theme)
   - Dark background color: #28243d
   - Light text colors for contrast
   - Adjusted gradients for dark mode

2. **Component Styling for Dark Mode**
   - Applies the primary color to all UI components
   - Adjusts contrast for dark backgrounds
   - Ensures readability in dark environments

3. **Dark Mode Utility Classes**
   - Same utility classes as light theme but with dark mode values
   - Adjusted background colors for better contrast
   - Modified hover and active states for dark backgrounds

#### Usage

This file is used when the dark theme is active and provides the purple color scheme on a dark background. It should be included after the core-dark.css file:

```html
<link rel="stylesheet" href="src/assets/css/core-dark.css">
<link rel="stylesheet" href="src/assets/css/theme-default-dark.css">
```

### Theme Bordered (theme-bordered.css)

The `theme-bordered.css` file (50KB) provides a bordered variation of the theme that can be applied to either light or dark mode.

#### File Overview

- **File Size**: 50KB
- **Purpose**: Adds borders to components for a more defined look
- **Compatible with**: Both light and dark themes

#### Key Features

1. **Bordered Components**
   - Adds borders to cards, buttons, and other components
   - Increases visual separation between elements
   - Provides a more structured layout

2. **Styling Modifications**
   - Adds border-radius to elements
   - Defines border colors that match the theme
   - Adjusts padding and margins for bordered elements

#### Usage

This file can be used in addition to either the light or dark theme to add borders to components:

```html
<!-- For light bordered theme -->
<link rel="stylesheet" href="src/assets/css/core.css">
<link rel="stylesheet" href="src/assets/css/theme-default.css">
<link rel="stylesheet" href="src/assets/css/theme-bordered.css">

<!-- For dark bordered theme -->
<link rel="stylesheet" href="src/assets/css/core-dark.css">
<link rel="stylesheet" href="src/assets/css/theme-default-dark.css">
<link rel="stylesheet" href="src/assets/css/theme-bordered.css">
```

### Theme Semi-Dark (theme-semi-dark.css)

The `theme-semi-dark.css` file (47KB) provides a semi-dark variation of the theme with a dark sidebar and light content area.

#### File Overview

- **File Size**: 47KB
- **Purpose**: Creates a hybrid theme with dark navigation and light content
- **Compatible with**: Works with core.css for content and core-dark.css for navigation

#### Key Features

1. **Mixed Mode Styling**
   - Dark navigation/sidebar
   - Light content area
   - Consistent primary color across both areas

2. **Component Adaptations**
   - Adjusts components based on their location (dark or light area)
   - Maintains consistent branding across the hybrid interface
   - Provides appropriate contrast in each section

#### Usage

This file is used to create a semi-dark theme with dark navigation and light content:

```html
<link rel="stylesheet" href="src/assets/css/core.css">
<link rel="stylesheet" href="src/assets/css/theme-default.css">
<link rel="stylesheet" href="src/assets/css/theme-semi-dark.css">
```

### Theme Customization

The theming system is designed to be customizable. To create a custom theme:

1. **Modify Primary Color**: Change the primary color values in the theme files
2. **Adjust Background Colors**: Modify the background colors for light or dark mode
3. **Update Text Colors**: Ensure text colors maintain proper contrast with backgrounds

Example of customizing the primary color in a theme file:

```css
/* Original */
.text-primary { color: #8c57ff !important; }
.bg-primary { background-color: #8c57ff !important; }

/* Customized to blue */
.text-primary { color: #3f51b5 !important; }
.bg-primary { background-color: #3f51b5 !important; }
```

### Theme Switching

The application supports dynamic theme switching using JavaScript:

```javascript
// Switch to dark theme
document.documentElement.classList.remove('light-style');
document.documentElement.classList.add('dark-style');

// Switch to light theme
document.documentElement.classList.remove('dark-style');
document.documentElement.classList.add('light-style');

// Add bordered variation
document.documentElement.classList.add('bordered-style');

// Add semi-dark variation
document.documentElement.classList.add('semi-dark-style');
```

## Modal Styling (modal.css)

The `modal.css` file (493B) provides custom styling and animations for modal dialogs in the MenuMitra Owner Dashboard application.

### File Overview

- **File Size**: 493B
- **Purpose**: Enhances modal dialogs with smooth animations
- **Compatible with**: Both light and dark themes

### Key Features

1. **Animation Durations**
   - Modal container: 0.5s animation duration
   - Modal dialog: 0.3s animation duration
   - Modal backdrop: 0.5s animation duration

2. **Custom Animations**
   - `modalFadeIn`: Animates modals from slightly above their final position with a fade-in effect
   - `modalFadeOut`: Animates modals upward with a fade-out effect when closing

### Usage

This file is used to enhance the appearance of Bootstrap modals with custom animations:

```html
<link rel="stylesheet" href="src/assets/css/modal.css">
```

To apply the custom animations to a modal:

```javascript
// For opening animation
$('#myModal').on('show.bs.modal', function () {
  $(this).css('animation-name', 'modalFadeIn');
});

// For closing animation
$('#myModal').on('hide.bs.modal', function () {
  $(this).css('animation-name', 'modalFadeOut');
});
```

### Customization

To modify the animations or add new ones:

1. **Adjust Animation Duration**:
   ```css
   .modal {
     animation-duration: 0.7s; /* Slower animation */
   }
   ```

2. **Modify Animation Effects**:
   ```css
   @keyframes modalFadeIn {
     from {
       opacity: 0;
       transform: scale(0.9); /* Scale effect instead of translation */
     }
     to {
       opacity: 1;
       transform: scale(1);
     }
   }
   ```

3. **Add New Animations**:
   ```
```

## Complete CSS File Reference

Below is a comprehensive reference of all CSS files in the MenuMitra Owner Dashboard application:

### Core and Theme Files

| File | Size | Purpose |
|------|------|---------|
| core.css | 785KB | Base styling for light theme, built on Bootstrap 5.3.3 |
| core-dark.css | 787KB | Base styling for dark theme |
| theme-default.css | 46KB | Purple color scheme for light theme |
| theme-default-dark.css | 47KB | Purple color scheme for dark theme |
| theme-bordered.css | 50KB | Bordered variation for components |
| theme-semi-dark.css | 47KB | Hybrid theme with dark navigation and light content |
| modal.css | 493B | Custom animations for modal dialogs |
| demo.css | 2.6KB | Styling for demonstration components |

### Application-Specific CSS Files

| File | Size | Purpose |
|------|------|---------|
| app-chat.css | 11KB | Chat application interface |
| app-email.css | 10KB | Email application interface |
| app-calendar.css | 3.6KB | Calendar application interface |
| app-kanban.css | 4.6KB | Kanban board for task management |
| app-invoice.css | 1.1KB | Invoice management interface |
| app-invoice-print.css | 372B | Invoice print optimization |
| app-ecommerce.css | 302B | E-commerce general pages |
| app-ecommerce-dashboard.css | 128B | E-commerce dashboard |
| app-logistics-dashboard.css | 1.0KB | Logistics dashboard |
| app-logistics-fleet.css | 2.1KB | Fleet management interface |
| app-academy.css | 472B | Academy application |
| app-academy-details.css | 87B | Academy details pages |

### Page-Specific CSS Files

| File | Size | Purpose |
|------|------|---------|
| page-auth.css | 2.0KB | Authentication pages |
| page-profile.css | 556B | User profile pages |
| page-user-view.css | 1.1KB | User detail view pages |
| page-account-settings.css | 145B | Account settings pages |
| page-faq.css | 707B | FAQ pages |
| page-pricing.css | 483B | Pricing pages |
| page-misc.css | 529B | Error and miscellaneous pages |
| page-icons.css | 309B | Icons showcase page |

### UI Component CSS Files

| File | Size | Purpose |
|------|------|---------|
| ui-carousel.css | 700B | Carousel components |
| cards-statistics.css | 188B | Statistical card components |
| cards-gamifications.css | 128B | Gamification card components |
| front-page.css | 5.3KB | Front-facing pages general styling |
| front-page-landing.css | 5.0KB | Landing page styling |
| front-page-pricing.css | 1017B | Front-facing pricing page |
| front-page-help-center.css | 431B | Help center styling |
| front-page-payment.css | 84B | Payment page styling |
| wizard-ex-checkout.css | 53B | Checkout wizard interface |
| dashboards-crm.css | 32B | CRM dashboard styling |

This comprehensive reference provides a quick overview of all CSS files in the application, their sizes, and their purposes. When working on a specific feature or page, refer to the appropriate CSS file to maintain consistency with the existing styling patterns.