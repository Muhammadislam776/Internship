import React from 'react';

export const docData = {
  'welcome': {
    title: 'Welcome',
    subtitle: 'Materially Documentation - React Vite.js + Material UI Admin Template',
    sections: [
      {
        heading: 'About',
        content: (
          <>
            <p><strong>Materially</strong> is the most developer-friendly & highly customizable React <strong>Hooks</strong> + Redux with <strong>Material UI</strong>.</p>
            <p>We've followed the best industry standards to make our product easy, fast, and highly scalable to work with. It allows you to build eye-catching, high-quality, high-performance responsive single-page applications.</p>
          </>
        )
      },
      {
        heading: 'Features',
        content: (
          <ul>
            <li>Material UI latest</li>
            <li>React Router DOM v6</li>
            <li>Vite.js for fast builds</li>
            <li>Fully Responsive Layout</li>
            <li>Clean & Well-commented Code</li>
          </ul>
        )
      }
    ]
  },
  'prerequisites': {
    title: 'Prerequisites',
    subtitle: 'What you need before you start',
    sections: [
      {
        heading: 'Node.js',
        content: <p>You need to have Node.js installed on your machine. We recommend using Node.js version 18.x or higher.</p>
      },
      {
        heading: 'NPM / Yarn',
        content: <p>NPM is included with Node.js. You can also use Yarn or pnpm for package management.</p>
      }
    ]
  },
  'getting-started': {
    title: 'Getting Started',
    subtitle: 'Start building with Materially',
    sections: [
      {
        heading: 'Overview',
        content: <p>Materially simplifies your dashboard creation process. Just extract the template, install dependencies, and run the development server.</p>
      }
    ]
  },
  'installation': {
    title: 'Installation',
    subtitle: 'Steps to run the template locally',
    sections: [
      {
        heading: 'Step 1: Install Dependencies',
        content: (
          <div className="icons-install-code" style={{ display: 'block', padding: '15px', marginBottom: '15px' }}>
            <code>npm install</code>
          </div>
        )
      },
      {
        heading: 'Step 2: Start Development Server',
        content: (
          <div className="icons-install-code" style={{ display: 'block', padding: '15px' }}>
            <code>npm run dev</code>
          </div>
        )
      }
    ]
  },
  'api': {
    title: 'Axios API Calls',
    subtitle: 'Handling data fetching',
    sections: [
      {
        heading: 'Configuration',
        content: <p>We use Axios for making HTTP requests. You can find the base Axios instance configured in the utils or services folder to handle tokens and interceptors.</p>
      }
    ]
  },
  'localization': {
    title: 'Localization',
    subtitle: 'Multi-language support',
    sections: [
      {
        heading: 'i18next',
        content: <p>Materially uses react-i18next for translation. Language files are located in the locales folder. You can easily add more languages by extending the JSON files.</p>
      }
    ]
  },
  'file-structure': {
    title: 'File Structure',
    subtitle: 'Understanding the project layout',
    sections: [
      {
        heading: 'src/ Directory',
        content: (
          <ul>
            <li><strong>components/</strong>: Reusable UI components</li>
            <li><strong>pages/</strong>: Main application views/pages</li>
            <li><strong>assets/</strong>: Images, global CSS, etc.</li>
            <li><strong>App.jsx</strong>: Main router and layout wrapper</li>
          </ul>
        )
      }
    ]
  },
  'routing': {
    title: 'Routing',
    subtitle: 'Navigation in Materially',
    sections: [
      {
        heading: 'React Router',
        content: <p>We use react-router-dom v6 for declarative routing. All routes are defined inside <code>App.jsx</code> wrapped in a <code>BrowserRouter</code>.</p>
      }
    ]
  }
};
