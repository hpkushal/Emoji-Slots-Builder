# Design Guidelines

## Overview

This document outlines the design principles, visual standards, and component guidelines for the Emoji Slots Builder application. Following these guidelines ensures a consistent, accessible, and engaging user experience across all parts of the application.

## Design Principles

### 1. Playful Yet Professional

The application should balance a fun, playful aesthetic appropriate for a casino game with professional design that instills confidence in the tool's capabilities.

- Use vibrant colors and playful elements in game areas
- Maintain clean, professional layouts in creation and management areas
- Incorporate subtle animations that enhance rather than distract

### 2. Intuitive and Accessible

The interface should be immediately understandable to users of all technical levels while remaining fully accessible.

- Prioritize clear visual hierarchies
- Use familiar patterns and metaphors
- Ensure all functionality is accessible via keyboard
- Support screen readers and assistive technologies
- Maintain sufficient color contrast

### 3. Responsive and Adaptive

The application should provide an optimal experience across all devices and screen sizes.

- Design mobile-first, then enhance for larger screens
- Ensure touch targets are appropriately sized
- Adapt layouts rather than simply scaling them
- Consider alternative interaction patterns for different input methods

### 4. Consistent and Cohesive

All parts of the application should feel like they belong to the same family.

- Maintain consistent spacing, typography, and color usage
- Use a unified component library
- Ensure transitions and animations follow the same patterns
- Apply the same interaction patterns across similar functions

## Color Palette

### Primary Colors

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Casino Green | `#1B5E20` | Primary buttons, headers, accents |
| Gold | `#FFC107` | Highlights, wins, important actions |
| Deep Purple | `#4A148C` | Secondary accents, feature indicators |
| Charcoal | `#263238` | Text, icons, borders |

### Secondary Colors

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Light Green | `#C8E6C9` | Backgrounds, success states |
| Light Gold | `#FFECB3` | Highlights, hover states |
| Light Purple | `#D1C4E9` | Secondary backgrounds, selected states |
| Light Gray | `#ECEFF1` | Backgrounds, disabled states |

### Feedback Colors

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Success Green | `#4CAF50` | Success messages, confirmations |
| Warning Amber | `#FF9800` | Warnings, cautions |
| Error Red | `#F44336` | Error messages, destructive actions |
| Info Blue | `#2196F3` | Information messages, help |

### Accessibility

- All text should maintain a minimum contrast ratio of 4.5:1 against its background
- Interactive elements should have a minimum contrast ratio of 3:1 against adjacent colors
- Never use color alone to convey meaning or state

## Typography

### Font Families

- **Primary Font**: Roboto - Used for all UI text, buttons, and labels
- **Secondary Font**: Poppins - Used for headings and emphasis
- **Monospace Font**: Roboto Mono - Used for code examples and technical information

### Font Sizes

| Context | Size | Weight | Line Height |
|---------|------|--------|-------------|
| Page Title | 32px | Bold (700) | 1.2 |
| Section Heading | 24px | SemiBold (600) | 1.3 |
| Subsection Heading | 20px | SemiBold (600) | 1.3 |
| Body Text | 16px | Regular (400) | 1.5 |
| Small Text | 14px | Regular (400) | 1.4 |
| Button Text | 16px | Medium (500) | 1.25 |
| Input Text | 16px | Regular (400) | 1.5 |

### Text Hierarchy

- Use font weight and size to establish hierarchy
- Maintain consistent alignment (generally left-aligned)
- Limit line length to 60-80 characters for optimal readability
- Use proper heading levels (h1, h2, etc.) for semantic structure

## Spacing System

We use an 8px grid system for consistent spacing throughout the application.

| Size | Value | Usage |
|------|-------|-------|
| xs | 4px | Minimal spacing, tight grouping |
| sm | 8px | Default spacing between related elements |
| md | 16px | Spacing between distinct elements |
| lg | 24px | Section padding, major element separation |
| xl | 32px | Page margins, major section separation |
| xxl | 48px | Large separations, hero sections |

## Component Guidelines

### Buttons

#### Primary Button

- Background: Casino Green (`#1B5E20`)
- Text: White (`#FFFFFF`)
- Border: None
- Border Radius: 4px
- Padding: 8px 16px
- Text: 16px, Medium (500)
- Hover: Darken by 10%
- Active: Darken by 15%
- Disabled: 50% opacity

#### Secondary Button

- Background: Transparent
- Text: Casino Green (`#1B5E20`)
- Border: 1px solid Casino Green (`#1B5E20`)
- Border Radius: 4px
- Padding: 8px 16px
- Text: 16px, Medium (500)
- Hover: Light Green background (`#C8E6C9`)
- Active: Darken by 5%
- Disabled: 50% opacity

#### Action Button (e.g., SPIN)

- Background: Gold (`#FFC107`)
- Text: Charcoal (`#263238`)
- Border: None
- Border Radius: 8px
- Padding: 12px 24px
- Text: 18px, Bold (700)
- Hover: Brighten by 10%
- Active: Darken by 5%
- Disabled: 50% opacity

### Form Elements

#### Text Input

- Background: White (`#FFFFFF`)
- Text: Charcoal (`#263238`)
- Border: 1px solid Light Gray (`#ECEFF1`)
- Border Radius: 4px
- Padding: 8px 12px
- Focus: 2px border in Primary Color
- Error: 1px border in Error Red

#### Checkbox/Radio

- Size: 20px × 20px
- Border: 1px solid Light Gray (`#ECEFF1`)
- Border Radius: 4px for checkbox, 50% for radio
- Checked: Casino Green (`#1B5E20`) fill
- Focus: 2px outline in Primary Color

#### Select

- Same styling as Text Input
- Dropdown icon: Charcoal (`#263238`)
- Options: White background, hover with Light Gray

### Cards

#### Game Card

- Background: White (`#FFFFFF`)
- Border: None
- Border Radius: 8px
- Shadow: 0 2px 4px rgba(0,0,0,0.1)
- Padding: 16px
- Hover: Shadow increase to 0 4px 8px rgba(0,0,0,0.15)
- Title: 18px, SemiBold (600)
- Subtitle: 14px, Regular (400)

#### Feature Card

- Background: Light Gray (`#ECEFF1`)
- Border: None
- Border Radius: 8px
- Padding: 24px
- Icon: 32px, Primary Color
- Title: 20px, SemiBold (600)
- Description: 16px, Regular (400)

### Navigation

#### Main Navigation

- Background: Casino Green (`#1B5E20`)
- Text: White (`#FFFFFF`)
- Active Item: Gold underline
- Hover: 10% lighter background
- Height: 64px
- Text: 16px, Medium (500)

#### Tab Navigation

- Background: White (`#FFFFFF`)
- Text: Charcoal (`#263238`)
- Active Tab: Casino Green (`#1B5E20`) text, bottom border
- Hover: Light Green (`#C8E6C9`) background
- Padding: 12px 16px
- Text: 16px, Medium (500)

### Slot Machine Elements

#### Reels

- Background: White (`#FFFFFF`)
- Border: 2px solid Gold (`#FFC107`)
- Border Radius: 4px
- Symbol Size: 64px × 64px (desktop), 48px × 48px (mobile)
- Symbol Spacing: 8px
- Spinning Animation: Smooth vertical scroll

#### Paylines

- Line Width: 3px
- Default Color: Semi-transparent white (rgba(255,255,255,0.5))
- Active Color: Based on payline color property
- Animation: Pulse effect when winning

#### Win Displays

- Background: Gold (`#FFC107`)
- Text: Charcoal (`#263238`)
- Border Radius: 4px
- Animation: Scale up and pulse
- Text: 20px, Bold (700)

## Icons

### Icon System

- Use Material Design Icons for consistency
- Maintain consistent sizing within contexts
- Use appropriate visual weight (outlined vs. filled)

### Common Icon Sizes

| Context | Size |
|---------|------|
| Navigation | 24px |
| Buttons | 20px |
| Form Elements | 18px |
| Small Actions | 16px |

### Icon Colors

- Icons should generally inherit the text color of their context
- Use the primary color for emphasis when needed
- Maintain sufficient contrast with backgrounds

## Animations and Transitions

### Principles

- Animations should enhance understanding, not distract
- Keep animations short and purposeful
- Provide reduced motion options for accessibility

### Timing

| Type | Duration | Easing |
|------|----------|--------|
| Micro-interactions | 100-200ms | ease-out |
| UI Transitions | 200-300ms | ease-in-out |
| Emphasis Animations | 300-500ms | ease-in-out |
| Slot Machine Spins | 2000-3000ms | custom cubic-bezier |

### Common Animations

- **Button Hover**: Subtle background color change
- **Card Hover**: Slight elevation increase
- **Page Transitions**: Fade in/out
- **Modal Open/Close**: Scale and fade
- **Reel Spin**: Accelerate, maintain, decelerate
- **Win Animation**: Pulse, glow, and particle effects

## Responsive Breakpoints

| Breakpoint | Width | Device Target |
|------------|-------|---------------|
| xs | < 576px | Mobile portrait |
| sm | ≥ 576px | Mobile landscape |
| md | ≥ 768px | Tablets |
| lg | ≥ 992px | Desktops |
| xl | ≥ 1200px | Large desktops |

### Responsive Behavior

- Stack elements vertically on smaller screens
- Reduce padding and margins proportionally
- Adjust font sizes for readability
- Hide secondary information when necessary
- Ensure touch targets are at least 44px × 44px on mobile

## Accessibility Guidelines

### Keyboard Navigation

- All interactive elements must be focusable
- Focus order should follow logical reading order
- Focus states must be clearly visible
- Provide keyboard shortcuts for common actions

### Screen Readers

- All images must have alt text
- Use semantic HTML elements
- Implement ARIA labels where appropriate
- Announce dynamic content changes
- Test with popular screen readers (NVDA, VoiceOver)

### Color and Contrast

- Meet WCAG AA standards at minimum (4.5:1 for text)
- Provide sufficient contrast for UI elements
- Never rely on color alone to convey information
- Test with color blindness simulators

## Implementation Notes

### CSS Architecture

- Use CSS modules for component scoping
- Follow BEM naming convention for global styles
- Maintain a consistent property order in declarations
- Use variables for colors, spacing, and typography

### Component Structure

- Build from atomic components up to complex ones
- Maintain a clear separation of concerns
- Document component props and usage
- Include accessibility considerations in component documentation

## Asset Guidelines

### Emoji Usage

- Use native emoji when possible for best cross-platform support
- Maintain consistent sizing relative to surrounding text
- Consider cultural implications of emoji choices
- Provide text alternatives for accessibility

### Images and Graphics

- Use SVG for icons and simple graphics
- Optimize all images for web
- Provide appropriate alt text
- Maintain consistent styling with the overall design
- Use responsive images with appropriate srcset attributes

## Example Component

```jsx
// Button Component Example
import React from 'react';
import './Button.css';

/**
 * Primary button component for user actions
 * 
 * @param {string} variant - 'primary', 'secondary', or 'action'
 * @param {string} size - 'sm', 'md', or 'lg'
 * @param {boolean} isDisabled - Whether the button is disabled
 * @param {function} onClick - Click handler function
 * @param {React.ReactNode} children - Button content
 */
const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  isDisabled = false, 
  onClick, 
  children 
}) => {
  const baseClass = 'esb-button';
  const classes = [
    baseClass,
    `${baseClass}--${variant}`,
    `${baseClass}--${size}`,
    isDisabled && `${baseClass}--disabled`
  ].filter(Boolean).join(' ');
  
  return (
    <button
      className={classes}
      disabled={isDisabled}
      onClick={isDisabled ? undefined : onClick}
      aria-disabled={isDisabled}
    >
      {children}
    </button>
  );
};

export default Button;
```

## Conclusion

These design guidelines provide a foundation for creating a consistent, accessible, and engaging user experience in the Emoji Slots Builder application. By following these standards, we ensure that all parts of the application work together harmoniously while maintaining the playful yet professional aesthetic appropriate for a casino game creation tool. 