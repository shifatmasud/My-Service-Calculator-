
import { ServiceData } from './types';

export const serviceData: ServiceData = {
  "pages": [
    {
      "name": "Static Page",
      "price_bdt": 3900,
      "notes": "Figma design + Framer build",
      "icon": "DesktopTower",
      "time_hours": 4,
      "allow_quantity": true
    },
    {
      "name": "Dynamic Page (CMS)",
      "price_bdt": 5900,
      "notes": "Includes content management setup",
      "icon": "Database",
      "time_hours": 6,
      "allow_quantity": true,
      "add_ons": [
        {
          "name": "Notion Database Sync",
          "price_bdt": 2000,
          "notes": "Optional add-on for CMS pages",
          "icon": "ArrowsClockwise",
          "time_hours": 2
        }
      ]
    }
  ],
  "custom_code": [
    {
      "name": "React / Custom Code Component",
      "price_bdt": 4500,
      "notes": "Reusable component, dynamic if needed",
      "icon": "Code",
      "time_hours": 5,
      "add_ons": [
        {
          "name": "3D Scene / Three.js Integration",
          "price_bdt": 10000,
          "notes": "Single interactive 3D scene",
          "icon": "Cube",
          "time_hours": 10
        },
        {
          "name": "Simple Animation / Framer Motion",
          "price_bdt": 2500,
          "notes": "Small component-level animations",
          "icon": "Sparkle",
          "time_hours": 2
        },
        {
          "name": "Complex Animation / GSAP",
          "price_bdt": 5000,
          "notes": "Complex multi-step animation sequences",
          "icon": "ShootingStar",
          "time_hours": 5
        }
      ]
    }
  ],
  "extras": [
    {
      "name": "UX Consultation",
      "price_bdt": 3000,
      "notes": "1-hour advice, review, improvement ideas",
      "icon": "ChatCircleDots",
      "time_hours": 1
    },
    {
      "name": "UX Research Report",
      "price_bdt": 20000,
      "notes": "Research 5–10 real users: Profiles, Interviews, Behavior & Mental Model analysis",
      "icon": "UsersThree",
      "time_days": 7
    },
    {
      "name": "UX Test Report",
      "price_bdt": 25000,
      "notes": "Testing 5–10 users, insights, recommendations",
      "icon": "Flask",
      "time_days": 10
    },
    {
      "name": "Notion Design System Docs",
      "price_bdt": 15000,
      "notes": "Typography, colors, components, guidelines",
      "icon": "BookOpen",
      "time_hours": 15
    },
    {
      "name": "Post-launch Support",
      "price_bdt": 10000,
      "notes": "1 month minor updates, bug fixes",
      "icon": "Wrench",
      "time_hours": 10
    },
    {
      "name": "SEO Basic Optimization",
      "price_bdt": 0,
      "notes": "Meta tags, basic performance tweaks",
      "icon": "ChartLineUp",
      "time_hours": 2
    }
  ]
};