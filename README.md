# Color Playground

Color Playground (also known as PaletteLab) is a professional, lightweight color design tool that helps developers and designers visualize and manage color palettes in real-time. It eliminates the guesswork of building UI color schemes by providing an instant, realistic dashboard preview of your chosen colors.

## Features

- **Live UI Preview:** See your colors applied instantly to a realistic mock dashboard layout, complete with buttons, badges, and text hierarchy.
- **Color Editing:** Adjust individual colors using native color pickers or precise HEX text inputs.
- **Color Validation:** Real-time feedback for invalid HEX codes to prevent errors.
- **Bulk Color Input:** Paste a list of colors (e.g., `Primary #E05AA6`) to instantly apply an entire palette at once.
- **Quick Color Preview:** Quickly test and visualize a raw list of hex codes without affecting your main palette.
- **Light/Dark Mode:** Toggle the application interface between light and dark themes to design comfortably in any environment.
- **CSS Variable Export:** Generate and copy a ready-to-use `:root` CSS block of your palette with a single click.
- **Reset:** Instantly revert the palette to its default state.

## Tech Stack

This project is built with vanilla web technologies, requiring no build tools or dependencies:
- **HTML5** (Semantic structure)
- **CSS3** (Custom properties, Flexbox, CSS Grid, `color-mix()`)
- **JavaScript** (ES6+, DOM manipulation)

## Project Structure

The application logic is cleanly separated into three core files:

```text
PaletteLab/
├── index.html   # Application layout, UI elements, and SVG icons
├── style.css    # Responsive design, light/dark themes, and animations
├── script.js    # Color manipulation, DOM updates, and bulk parsing
└── README.md    # Project documentation
```

## Getting Started

To run the project locally, you do not need a backend, package manager, or any build processes:

1. Clone or download this repository to your local machine.
2. Open the folder containing the project files.
3. Double-click on `index.html` to open it in your preferred web browser.

## Usage

- **Edit Colors:** Click the color swatch block to open the native color picker, or manually type a 6-digit hex code into the input field next to it.
- **Use Bulk Input:** In the "Bulk Input" section, paste your palette in the format `LabelName #HEX` (one per line) and click "Apply Colors".
- **Quick Preview:** Paste a list of hex codes (one per line) into the "Quick Color Preview" box to see standalone color swatches instantly.
- **Preview Palette:** As you change colors, observe the "Live Preview" panel on the right. It updates automatically to reflect your new palette across backgrounds, text, buttons, and status badges.
- **Switch Themes:** Use the "Light" and "Dark" buttons in the top right header to change the application's UI theme.
- **Export CSS:** Click the "Export CSS" button in the Palette Colors panel to reveal a text area containing your palette mapped to CSS variables.
- **Reset Project:** Click the "Reset" button to restore the original default colors.

## Design & UX

Color Playground features a modern, minimal, and premium design philosophy. It utilizes the Inter font for crisp typography and generous whitespace for excellent visual hierarchy. The application is fully responsive, utilizing CSS Grid to smoothly stack the controls and live preview vertically on tablet and mobile devices. Micro-interactions like hover states, focus outlines, and smooth color transitions provide a polished, app-like experience.

## Browser Compatibility

This project relies on modern web standards and APIs, including:
- **CSS Custom Properties (Variables)** for real-time theming.
- **CSS `color-mix()`** for dynamic opacity blending on status badges.
- **CSS Grid & Flexbox** for layouts.
- Compatible with all modern, up-to-date browsers (Chrome, Edge, Firefox, Safari).

## Future Improvements

*Ideas for future enhancements:*
- Add the ability to export palettes as JSON or Tailwind configuration formats.
- Provide a contrast checker to ensure text meets accessibility guidelines against its background.
- Include a color history or "undo" feature to revert accidental changes.
- Add additional mock UI layouts (e.g., e-commerce product card, chat interface) to test palettes in different contexts.