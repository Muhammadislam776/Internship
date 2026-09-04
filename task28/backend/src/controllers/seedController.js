const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const bcrypt = require('bcryptjs');

const seedDatabase = async (req, res) => {
  try {
    console.log('Seeding database with realistic FlowBoard data...');

    // Clear existing collections
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});

    // 1. Create Users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const users = await User.insertMany([
      {
        name: 'Muhammad',
        email: 'muhammad@flowboard.dev',
        password: hashedPassword,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        role: 'Lead Developer'
      },
      {
        name: 'Sophia Chen',
        email: 'sophia@flowboard.dev',
        password: hashedPassword,
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
        role: 'Product Designer'
      },
      {
        name: 'Alex Rivera',
        email: 'alex@flowboard.dev',
        password: hashedPassword,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        role: 'Frontend Lead'
      },
      {
        name: 'Elena Rostova',
        email: 'elena@flowboard.dev',
        password: hashedPassword,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        role: 'Backend Engineer'
      },
      {
        name: 'Marcus Vance',
        email: 'marcus@flowboard.dev',
        password: hashedPassword,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        role: 'DevOps Specialist'
      }
    ]);

    const muhammad = users[0];
    const sophia = users[1];
    const alex = users[2];
    const elena = users[3];
    const marcus = users[4];

    // 2. Create Projects
    const projects = await Project.insertMany([
      {
        name: 'Website Redesign 2026',
        description: 'Complete overhaul of FlowBoard public landing page and brand identity with modern glassmorphic theme.',
        cover_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
        status: 'ACTIVE',
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        members: [muhammad._id, sophia._id, alex._id]
      },
      {
        name: 'Mobile App React Native',
        description: 'Cross-platform iOS and Android companion app with offline synchronization & quick task widget.',
        cover_image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
        status: 'ACTIVE',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        members: [alex._id, elena._id, marcus._id]
      },
      {
        name: 'Marketing Campaign Q3',
        description: 'Global SaaS launch strategy, product hunt showcase, and interactive demo landing page.',
        cover_image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
        status: 'ACTIVE',
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        members: [sophia._id, muhammad._id]
      },
      {
        name: 'E-Commerce Platform',
        description: 'Stripe payments integration, custom billing dashboard, and enterprise seat management.',
        cover_image: 'https://images.unsplash.com/photo-1556742049-0a67568d049f?auto=format&fit=crop&w=800&q=80',
        status: 'ACTIVE',
        dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        members: [elena._id, marcus._id, muhammad._id]
      },
      {
        name: 'CRM & Analytics Development',
        description: 'Real-time analytics engine with custom chart visualization and predictive project velocity metrics.',
        cover_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
        status: 'ACTIVE',
        dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        members: [muhammad._id, elena._id]
      }
    ]);

    const projRedesign = projects[0];
    const projMobile = projects[1];

    // 3. Create Tasks for Website Redesign & Mobile App
    const tasksData = [
      // BACKLOG
      {
        project_id: projRedesign._id,
        title: 'Figma Design Tokens & Dark Glass Theme',
        description: 'Establish Midnight Navy, Cyber Cyan, and Electric Blue color variables and typography spec.',
        status: 'BACKLOG',
        priority: 'MEDIUM',
        position: 0,
        assignee_id: sophia._id,
        due_date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        cover_image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=600&q=80',
        tags: ['Design', 'UI/UX'],
        subtasks: [
          { title: 'Define color tokens in CSS', completed: true },
          { title: 'Create Figma component library', completed: false }
        ],
        comments: [
          { user_id: sophia._id, content: 'Drafting the glassmorphic card overlays today!' }
        ]
      },
      {
        project_id: projRedesign._id,
        title: 'Dark Mode Accessibility Audit',
        description: 'Ensure color contrast ratio satisfies WCAG 2.1 AAA for Midnight Navy backgrounds.',
        status: 'BACKLOG',
        priority: 'LOW',
        position: 1,
        assignee_id: alex._id,
        due_date: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
        tags: ['Accessibility', 'QA'],
        subtasks: [
          { title: 'Lighthouse accessibility check', completed: false },
          { title: 'Screen reader navigation test', completed: false }
        ]
      },

      // TODO
      {
        project_id: projRedesign._id,
        title: 'Implement @dnd-kit Drag and Drop Engine',
        description: 'Integrate dnd-kit core with custom drop indicators and smooth transition effects.',
        status: 'TODO',
        priority: 'URGENT',
        position: 0,
        assignee_id: muhammad._id,
        due_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Overdue!
        cover_image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
        tags: ['Frontend', 'React'],
        subtasks: [
          { title: 'Setup DndContext & Sensors', completed: true },
          { title: 'Column droppable containers', completed: true },
          { title: 'Card sortable items', completed: false },
          { title: 'Optimistic position persistence API call', completed: false }
        ],
        comments: [
          { user_id: alex._id, content: 'Make sure to handle optimistic rollbacks gracefully if network disconnects!' }
        ]
      },
      {
        project_id: projRedesign._id,
        title: 'Express API Task Position Endpoint',
        description: 'Build PATCH /api/tasks/:id handler to recalculate numeric position indices across columns.',
        status: 'TODO',
        priority: 'HIGH',
        position: 1,
        assignee_id: elena._id,
        due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        tags: ['Backend', 'Express', 'MongoDB'],
        subtasks: [
          { title: 'MongoDB updateMany position query', completed: true },
          { title: 'Validate status and position payloads', completed: false }
        ]
      },

      // IN_PROGRESS
      {
        project_id: projRedesign._id,
        title: '3D Flip Statistic Cards Component',
        description: 'Create interactive 3D cards with perspective rotateY transformations for key performance metrics.',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        position: 0,
        assignee_id: alex._id,
        due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        cover_image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=600&q=80',
        tags: ['UI', 'CSS3', 'Animation'],
        subtasks: [
          { title: 'HTML structure & backface-visibility', completed: true },
          { title: 'Hover & click flip trigger', completed: true },
          { title: 'Animated counter figures', completed: false }
        ],
        comments: [
          { user_id: muhammad._id, content: 'Looks super slick on the dashboard!' }
        ]
      },
      {
        project_id: projRedesign._id,
        title: 'Interactive "How FlowBoard Works" Play Card',
        description: 'Interactive demo workflow modal illustrating step-by-step data flow from React drag to Express API.',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        position: 1,
        assignee_id: sophia._id,
        due_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        tags: ['Interactive', 'Modal'],
        subtasks: [
          { title: 'Step-by-step animation sequence', completed: true },
          { title: 'Modal trigger & keyboard ESC close', completed: false }
        ]
      },

      // IN_REVIEW
      {
        project_id: projRedesign._id,
        title: 'Global Search & Multi-Filter Bar',
        description: 'Real-time client-side and server-side search by title, tag, priority, and assignee.',
        status: 'IN_REVIEW',
        priority: 'HIGH',
        position: 0,
        assignee_id: muhammad._id,
        due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        tags: ['Search', 'Filters'],
        subtasks: [
          { title: 'Debounced search query input', completed: true },
          { title: 'Priority pill selector buttons', completed: true },
          { title: 'Assignee filter dropdown', completed: true }
        ],
        comments: [
          { user_id: elena._id, content: 'PR is submitted and ready for code review!' }
        ]
      },

      // DONE
      {
        project_id: projRedesign._id,
        title: 'Project Architecture & Database Schema Design',
        description: 'Designed MongoDB Mongoose schemas for Projects, Tasks, Users, Comments, and Subtasks.',
        status: 'DONE',
        priority: 'URGENT',
        position: 0,
        assignee_id: elena._id,
        due_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        cover_image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=600&q=80',
        tags: ['Database', 'Architecture'],
        subtasks: [
          { title: 'Model relational references', completed: true },
          { title: 'Add compound indexes for position query', completed: true }
        ],
        comments: [
          { user_id: marcus._id, content: 'Verified schema efficiency and index specs.' }
        ]
      },
      {
        project_id: projRedesign._id,
        title: 'Authentication & Protected Dashboard Routes',
        description: 'JWT authorization middleware and secure login session persistence.',
        status: 'DONE',
        priority: 'HIGH',
        position: 1,
        assignee_id: muhammad._id,
        due_date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        tags: ['Auth', 'Security'],
        subtasks: [
          { title: 'JWT signing & verification', completed: true },
          { title: 'Login & Register forms', completed: true }
        ]
      }
    ];

    await Task.insertMany(tasksData);

    console.log('Database successfully seeded!');
    if (res) {
      return res.json({
        success: true,
        message: 'Database seeded successfully with realistic projects, tasks, and users!',
        stats: {
          users: users.length,
          projects: projects.length,
          tasks: tasksData.length
        }
      });
    }
  } catch (error) {
    console.error('Seeding Error:', error);
    if (res) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = { seedDatabase };
