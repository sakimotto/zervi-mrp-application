# UI Preview Plan for Zervi MRP Application

## Project Overview for Beginners
This document explains the Zervi MRP (Material Requirements Planning) application in simple terms. Think of this application as a digital command center for Zervi Group's manufacturing operations across their four divisions: Automotive, Camping, Apparel, and Zervitek (Technical Textile).

### What This Application Does
- Tracks materials, products, and work-in-progress items
- Manages manufacturing operations (Laminating, Cutting, Sewing, Embroidery)
- Handles transfers between different divisions
- Calculates costs and helps with planning production

### Technical Parts (Simplified)
- **Backend**: The "brain" of the system (using Node.js with Express)
- **Frontend**: What users see and interact with (using React with Material UI)
- **Database**: Where all information is stored (using PostgreSQL)

## Current Status - March 29, 2025
- All documentation is complete and reviewed
- The user interface has been designed but we haven't seen it running yet
- We want to look at the design without changing any of the original code

## Our Preview Plan
To see the user interface without risking any changes to the original work:

1. **Create a separate preview folder**: This keeps our viewing area separate from the real project
2. **Make static HTML versions**: Convert the interactive screens to simple viewable pages
3. **Focus on important screens**: Start with Dashboard, then look at other key pages

## Dashboard Design Features
Based on our review of the code, the dashboard includes:
- Summary cards showing important numbers (inventory, orders, etc.)
- Different views for each division
- Color-coded indicators (green for good, yellow for caution, red for problems)
- Simple navigation buttons to move to detailed sections

## What We'll Do Next
1. Create our preview folder structure
2. Generate simple HTML versions of the main screens
3. Add simple explanations for each screen
4. Possibly create visual mockups to better see the design

## Important Note
This project is being reviewed for feedback purposes only. We will not change any original code. All our preview work will happen in a separate folder to keep the original project intact.

## Preview Folder Structure
We plan to organize our preview files like this:
```
/zervi-ui-preview/
  /dashboard/
  /manufacturing/
  /inventory/
  /divisions/
  /transfers/
  index.html (main navigation page)
```
